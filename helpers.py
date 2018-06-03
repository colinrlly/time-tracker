from __future__ import print_function  # Needs to be imported first

import os
import datetime
import sys
from datetime import datetime
from apiclient.discovery import build
from httplib2 import Http
from oauth2client import file, client, tools
from oauth2client.client import OAuth2WebServerFlow


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


def save_users_activity(session, model, user):
    """ In the database @session, saves the @user's last stopped event
        to Google calendar 
        
        Returns: URL to newly created Google Calendar event 
    """

    # Get the last activity
    instance = model.query.filter_by(user=user).first()

    # Setup the Calendar API
    SCOPES = 'https://www.googleapis.com/auth/calendar'
    store = file.Storage('credentials.json')
    creds = store.get()
    if not creds or creds.invalid:
        flow = client.OAuth2WebServerFlow(client_id=os.environ['GOOGLE_CLIENT_ID'],
                                            client_secret=os.environ['GOOGLE_CLIENT_SECRET'],
                                            scope=SCOPES,
                                            redirect_urls='/')
        creds = tools.run_flow(flow, store)
    service = build('calendar', 'v3', http=creds.authorize(Http()))

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
    event = service.events().insert(calendarId='primary', body=event).execute()

    return str(event.get('htmlLink'))
