"""
Shows basic usage of the Google Calendar API. Creates a Google Calendar API
service object and outputs a list of the next 10 events on the user's calendar.
"""
from __future__ import print_function
from apiclient.discovery import build
from httplib2 import Http
from oauth2client import file, client, tools
import datetime
import sys

# Setup the Calendar API
SCOPES = 'https://www.googleapis.com/auth/calendar'
store = file.Storage('credentials.json')
creds = store.get()
if not creds or creds.invalid:
    flow = client.flow_from_clientsecrets('client_secret.json', SCOPES)
    creds = tools.run_flow(flow, store)
service = build('calendar', 'v3', http=creds.authorize(Http()))

# Record the amount of time this event is running for
start = datetime.datetime.utcnow().isoformat() + 'Z' # 'Z' indicates UTC time

# While waiting parse the color of the event
if sys.argv[1] == 'Games':
  colorId = 8
elif sys.argv[1] == 'Plants':
  colorId = 10
elif sys.argv[1] == 'Work':
  colorId = 2
elif sys.argv[1] == 'Personal':
  colorId = 5
elif sys.argv[1] == 'Art':
  colorId = 3
else:
  colorId = 1

# Enter key records the end time finishes the program
input("Press Enter key to continue...")
end = datetime.datetime.utcnow().isoformat() + 'Z'

# Make the event
event = {
  'summary': sys.argv[1],
  'start': {
    'dateTime': start,
    'timeZone': 'UTC',
  },
  'end': {
    'dateTime': end,
    'timeZone': 'UTC',
  },
  'reminders': {
      'useDefault': False
  },
  'colorId': colorId
}

# Add the event to the calendar
event = service.events().insert(calendarId='primary', body=event).execute()
print('Event created:' + str(event.get('htmlLink')))
