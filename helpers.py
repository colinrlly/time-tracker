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
CLIENT_ID = client_id=os.environ['GOOGLE_CLIENT_ID']
CLIENT_SECRET = client_secret=os.environ['GOOGLE_CLIENT_SECRET']
SCOPES = 'https://www.googleapis.com/auth/calendar'
API_SERVICE_NAME = 'calendar'
API_VERSION = 'v3'


def get_or_create_user(session, model, user_id):
    instance = model.query.filter_by(id=user_id).first()

    if instance:
        session.close()
        return instance
    else:
        instance = model(id=user_id)
        session.add(instance)
        session.commit()
        session.close()
        return instance


def set_users_activity(session, model, user, activity):
    """ In the database @session, sets @user's current @activity """
    user.current_activity = activity
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


def save_users_activity(model, user, calendar):
    """ Saves the @user's last stopped event
        to Google calendar 
        
        Returns: URL to newly created Google Calendar event 
    """
    # Parse the color of the event
    if user.current_activity == 'Games':
        colorId = 8
    elif user.current_activity == 'Plants':
        colorId = 10
    elif user.current_activity == 'Work':
        colorId = 2
    elif user.current_activity == 'Personal':
        colorId = 5
    elif user.current_activity == 'Art':
        colorId = 3
    else:
        colorId = 1

    # Make the event
    event = {
        'summary': user.current_activity,
        'start': {
            'dateTime': user.started_at.isoformat() + 'Z',
            'timeZone': 'UTC'},
        'end': {
            'dateTime': user.stopped_at.isoformat() + 'Z',
            'timeZone': 'UTC'},
        'reminders': {
            'useDefault': False},
        'colorId': colorId
    }

    # Attempt to add the event to the calendar
    try:
        event = calendar.events().insert(calendarId='primary', body=event).execute()  # Add the event to the calendar
    except HttpAccessTokenRefreshError:  # Google credentials were revoked, need to authorize again
        return False

    return True


def get_idinfo(token):
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)

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
