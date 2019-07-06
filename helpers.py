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
    """ In the database @session, sets @user's current @activity """
    user.current_activity = activity_id
    user.started_at = datetime.utcnow()
    session.add(user)
    session.commit()
    session.close()

    return 'set'


def stop_users_activity(session, model, user):
    """ In the database @session, stops @user's current activity """

    user.stopped_at = datetime.utcnow()
    session.add(user)
    session.commit()
    session.close()

    return 'stopped'


def get_users_current_activity(session, Activity, user):
    """ Gets the users current activity """

    activity_id = user.current_activity

    if not activity_id:  # User has not added a current activity yet
        return {"success": False}

    activity = Activity.query.get(activity_id)

    if activity:
        started_at = user.started_at.isoformat() + 'Z'
        stopped_at = user.stopped_at.isoformat() + 'Z'
        name = activity.name
        color = activity.color

        return {
            "success": True,
            "started_at": started_at,
            "stopped_at": stopped_at,
            "name": name,
            "color": color
        }
    else:
        return {"success": False}


def get_all_users_activities(session, Activity, user_id):
    """ Gets a list of the users activities """

    activities = Activity.query.filter_by(user_id=user_id).all()

    activities = list(
        map(lambda x: {'id': x.id, 'name': x.name, 'color': x.color}, activities))

    return activities


def edit_users_activity(session, Activity, activity_id, new_name, new_color):
    """ Edits a users activity """

    activity = Activity.query.get(activity_id)

    if activity.name != new_name:
        activity.name = new_name
    if activity.color != new_color:
        activity.color = new_color
    
    session.add(activity)
    session.commit()
    session.close()


def delete_users_activity(session, Activity, activity_id):
    """ Deletes an activity by id """

    activity = Activity.query.get(activity_id)
    session.delete(activity)
    session.commit()


def save_users_activity(User, Activity, user, calendar):
    """ Saves the @user's last stopped event
        to Google calendar.
    """
    # Get the user's current activity
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
        event = calendar.events().insert(calendarId='primary',
                                         body=event).execute()  # Add the event to the calendar
    except HttpAccessTokenRefreshError:  # Google credentials were revoked, need to authorize again
        return False

    return True


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
