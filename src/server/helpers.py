from __future__ import print_function  # Needs to be imported first

import os
import datetime
import sys

from flask import render_template, redirect, url_for

import google
from datetime import datetime
from apiclient.discovery import build
from httplib2 import Http
from oauth2client import file, client, tools
from oauth2client.client import OAuth2WebServerFlow, HttpAccessTokenRefreshError
from google.oauth2 import id_token
from google.auth.transport import requests
import googleapiclient.discovery


#  Google API credentials
CLIENT_ID = client_id = os.environ['GOOGLE_CLIENT_ID']
CLIENT_SECRET = client_secret = os.environ['GOOGLE_CLIENT_SECRET']
SCOPES = 'https://www.googleapis.com/auth/calendar'
API_SERVICE_NAME = 'calendar'
API_VERSION = 'v3'


def get_or_create_user(session, model, user_id):
    """
        Returns user with id == user_id, if there is no user with that id creates a new user.
    """
    instance = model.query.filter_by(id=user_id).first()

    if instance:
        return instance
    else:
        instance = model(id=user_id)
        session.add(instance)
        session.commit()
        session.close()
        return instance


def set_users_activity(session, model, user, activity_id):
    """
        Sets @user's current @activity in the database @session.

        Sets user.started_at to utc now and updates user's current activity_id.
    """
    user.current_activity = activity_id
    user.started_at = datetime.utcnow()
    session.add(user)
    session.commit()
    session.close()

    return 'set'


def stop_users_activity(session, model, user):
    """
        stops @user's current activity in the database @session.

        Sets user.stopped at to utc now.
    """

    user.stopped_at = datetime.utcnow()
    session.add(user)
    session.commit()
    session.close()

    return 'stopped'


def edit_users_activity(session, Activity, activity_id, new_name, new_color):
    """
        Edits a users activity.
    """

    activity = Activity.query.get(activity_id)

    if activity.name != new_name:
        activity.name = new_name
    if activity.color != new_color:
        activity.color = new_color
    
    session.add(activity)
    session.commit()
    session.close()


def delete_users_activity(session, Activity, activity_id):
    """
        Deletes an activity by id.
    """

    activity = Activity.query.get(activity_id)
    session.delete(activity)
    session.commit()


def save_users_activity(session, User, Activity, user):
    """
        Saves the @user's last stopped event to Google calendar.
    """
    # Check if the user doesn't have any credentials at all.
    if not user.credentials:
        return {'code': 'need_authorization', 'auth_url': url_for('authorize')}

    # Check if the credentials are invalid.
    try:
        credentials = client.OAuth2Credentials.from_json(user.credentials)

        # Credentials expired, just refresh them.
        if credentials.access_token_expired:
            credentials.refresh(Http())
    # Token could not be refreshed, need to auth again.
    except HttpAccessTokenRefreshError:
        return {'code': 'need_authorization', 'auth_url': url_for('authorize')}

    # By this point we know the credentials are valid.
    # Build the Google Calendar object.
    calendar = googleapiclient.discovery.build(
        API_SERVICE_NAME, API_VERSION, credentials=credentials)

    # Store credentials in the database.
    user.credentials = credentials.to_json()
    session.add(user)
    session.commit()

    # Get the user's current activity.
    activity_id = user.current_activity
    activity = Activity.query.get(activity_id)
    name = activity.name
    color = activity.color

    # Make the event
    event = {
        'summary': name,
        'start': {
            'dateTime': user.started_at.isoformat() + 'Z',
            'timeZone': 'UTC'},
        'end': {
            'dateTime': user.stopped_at.isoformat() + 'Z',
            'timeZone': 'UTC'},
        'reminders': {
            'useDefault': False},
        'colorId': color
    }

    # Attempt to add the event to the calendar
    try:
        # Add the event to the calendar
        event = calendar.events().insert(calendarId='primary', body=event).execute()
    # Google credentials were revoked, need to authorize again
    except HttpAccessTokenRefreshError:
        return {'code': 'need_authorization', 'auth_url': url_for('authorize')}

    return {'code': 'success'}


def get_idinfo(token):
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(), CLIENT_ID)

        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        return idinfo
    except ValueError:
        # Invalid token
        print('invalid token')

        return False


def credentials_to_dict(credentials):
    return {'token': credentials.token,
            'refresh_token': credentials.refresh_token,
            'token_uri': credentials.token_uri,
            'client_id': credentials.client_id,
            'client_secret': credentials.client_secret,
            'scopes': credentials.scopes}


def list_users_events(session, User, Activity, user, startOfRange, endOfRange):
    # Check if the user doesn't have any credentials at all.
    if not user.credentials:
        return {'code': 'need_authorization', 'auth_url': url_for('authorize')}

    # Check if the credentials are invalid.
    try:
        credentials = client.OAuth2Credentials.from_json(user.credentials)

        # Credentials expired, just refresh them.
        if credentials.access_token_expired:
            credentials.refresh(Http())
    # Token could not be refreshed, need to auth again.
    except HttpAccessTokenRefreshError:
        return {'code': 'need_authorization', 'auth_url': url_for('authorize')}

    # By this point we know the credentials are valid.
    # Build the Google Calendar object.
    calendar = googleapiclient.discovery.build(
        API_SERVICE_NAME, API_VERSION, credentials=credentials)

    # Store credentials in the database.
    user.credentials = credentials.to_json()
    session.add(user)
    session.commit()
    # session.close()

    # Get the user's activities
    activities = Activity.query.filter_by(user_id=user.id).all()
    names = [activity.name for activity in activities]
    colors = { a.name: a.color for a in activities}
    
    # Get and format the users Google Calendar events
    page_token = None  # Used to get the next 'page' of results
    trimmed_list = []

    while True:
        try:
            # Get list of users events from Google Calendar
            events_list = calendar.events().list(
                calendarId='primary',
                timeMax=endOfRange,
                timeMin=startOfRange,
                singleEvents=True,  # Expand recurring events
                pageToken=page_token).execute()

            # calendars = calendar.calendarList().list().execute()
        # Google credentials were revoked, need to authorize again
        except HttpAccessTokenRefreshError:
            return {'code': 'need_authorization', 'auth_url': url_for('authorize')}

        # Loop through the retrieved events and trim the results
        for x in events_list['items']:
            if (('end' in x) and ('start' in x) and ('summary' in x)):
                if not ('colorId' in x):
                    colorId = '1'
                elif x['summary'] in colors:
                    colorId = colors[x['summary']]
                else:
                    colorId = x['colorId']

                trimmed_list.append({
                    'end': x['end'],
                    'start': x['start'],
                    'summary': x['summary'],
                    'colorId': colorId,
                    'inActivities': (x['summary'] in names)
                })
        
        page_token = events_list.get('nextPageToken')
        if not page_token:
            break

    # return calendars
    # return {'code': 'success', 'list': events_list }
    return {'code': 'success', 'start': startOfRange, 'end': endOfRange, 'list': trimmed_list }
