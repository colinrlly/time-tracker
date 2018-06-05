from __future__ import print_function  # Needs to be imported first

import os
import datetime
import sys

import google
from datetime import datetime
from apiclient.discovery import build
from httplib2 import Http
from oauth2client import file, client, tools
from oauth2client.client import OAuth2WebServerFlow
from google.oauth2 import id_token
from google.auth.transport import requests
import googleapiclient.discovery


#  Google API credentials
CLIENT_ID = client_id=os.environ['GOOGLE_CLIENT_ID']
CLIENT_SECRET = client_secret=os.environ['GOOGLE_CLIENT_SECRET']
SCOPES = 'https://www.googleapis.com/auth/calendar'
API_SERVICE_NAME = 'calendar'
API_VERSION = 'v3'

def set_users_activity(session, model, user, activity):
    """ In the database @session, sets or creates @user's current @activity """
    instance = model.query.filter_by(user=user).first()
    if instance:
        instance.activity = activity
        instance.started_at = datetime.utcnow()
        session.add(instance)
        session.commit()
        return 'updated'
    else:
        instance = model(user=user, activity=activity, started_at=datetime.utcnow())
        session.add(instance)
        session.commit()
        return 'created'


def stop_users_activity(session, model, user):
    """ In the database @session, stops @user's current activity """

    instance = model.query.filter_by(user=user).first()
    instance.stopped_at = datetime.utcnow()
    session.add(instance)
    session.commit()

    return 'stopped'


def save_users_activity(model, user, calendar):
    """ Saves the @user's last stopped event
        to Google calendar 
        
        Returns: URL to newly created Google Calendar event 
    """
    # Get the last activity
    instance = model.query.filter_by(user=user).first()

    # Parse the color of the event
    if instance.activity == 'Games':
        colorId = 8
    elif instance.activity == 'Plants':
        colorId = 10
    elif instance.activity == 'Work':
        colorId = 2
    elif instance.activity == 'Personal':
        colorId = 5
    elif instance.activity == 'Art':
        colorId = 3
    else:
        colorId = 1

    # Make the event
    event = {
    'summary': instance.activity,
    'start': {
        'dateTime': instance.started_at.isoformat() + 'Z',
        'timeZone': 'UTC',
    },
    'end': {
        'dateTime': instance.stopped_at.isoformat() + 'Z',
        'timeZone': 'UTC',
    },
    'reminders': {
        'useDefault': False
    },
    'colorId': colorId
    }

    # Add the event to the calendar
    event = calendar.events().insert(calendarId='primary', body=event).execute()

    return str(event.get('htmlLink'))


def get_auth_token(token):
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)

        # Or, if multiple clients access the backend server:
        # idinfo = id_token.verify_oauth2_token(token, requests.Request())
        # if idinfo['aud'] not in [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]:
        #     raise ValueError('Could not verify audience.')


        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')

        # If auth request is from a G Suite domain:
        # if idinfo['hd'] != GSUITE_DOMAIN_NAME:
        #     raise ValueError('Wrong hosted domain.')

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        return 'auth token: ' + idinfo['sub']
    except ValueError:
        # Invalid token
        return 'invalid'


def credentials_to_dict(credentials):
  return {'token': credentials.token,
          'refresh_token': credentials.refresh_token,
          'token_uri': credentials.token_uri,
          'client_id': credentials.client_id,
          'client_secret': credentials.client_secret,
          'scopes': credentials.scopes}
