"""
    Created by Colin Reilly 5/23/18

    Main Flask server file. An app to log how long a user performs 
    a certain activity and then record the activity in Google Calendar.
"""

import os
import flask
from datetime import datetime

from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
import psycopg2

import google
from google.oauth2 import credentials, id_token
import google_auth_oauthlib.flow
import googleapiclient.discovery
from oauth2client import client
from google.auth.transport import requests

from helpers import *

# Set up Flask app
app = Flask(__name__, instance_relative_config=True)
app.config.from_pyfile('development.py')
db = SQLAlchemy(app)
app.secret_key = os.environ['FLASK_SECRET_KEY']

from models import *

# Set up Google Constants
CLIENT_ID = client_id=os.environ['GOOGLE_CLIENT_ID']
CLIENT_SECRET = client_secret=os.environ['GOOGLE_CLIENT_SECRET']
SCOPES = 'https://www.googleapis.com/auth/calendar'
API_SERVICE_NAME = 'calendar'
API_VERSION = 'v3'


@app.route('/')
def home():
    """ Renders the homepage template. """
    return render_template("index.html")


@app.route('/api/start-activity', methods=['POST'])
def update_activity():
    """ Updates the servers records of which activity the user is currently doing. """
    
    set_users_activity(db.session, 
        UsersCurrentActivities, 
        user='colin', 
        activity=request.form['activity'])

    return 'success'


@app.route('/api/stop-activity', methods=['POST'])
def stop_activity():
    """ Stops the user's current activity """

    stop_users_activity(db.session,
        UsersCurrentActivities,
        user='colin')

    return 'success'


@app.route('/api/verify-id-token', methods=['POST'])
def verify_id_token():
    token = request.form['token']

    return render_template('index.html')


@app.route('/api/save-activity')
def save_activity():
    if 'credentials' not in flask.session:
        return flask.redirect('authorize')

    # Load credentials from the session.
    credentials = client.OAuth2Credentials.from_json(flask.session['credentials'])
    # credentials = google.oauth2.credentials.Credentials(
    #     flask.session['credentials'])

    calendar = googleapiclient.discovery.build(
        API_SERVICE_NAME, API_VERSION, credentials=credentials)

    # Store credentials in the session.
    # ACTION ITEM: In a production app, you likely want to save these
    #              credentials in a persistent database instead.
    flask.session['credentials'] = credentials.to_json()

    save_users_activity(
        UsersCurrentActivities,
        'colin',
        calendar)

    return flask.redirect(flask.url_for('home'))


@app.route('/authorize')
def authorize():
    # Create flow instance to manage the OAuth 2.0 Authorization Grant Flow steps.
    flow = client.OAuth2WebServerFlow(client_id=CLIENT_ID,
                                      client_secret=CLIENT_SECRET,
                                      scope=SCOPES)

    flow.redirect_uri = flask.url_for('oauth2callback', _external=True)

    authorization_url = flow.step1_get_authorize_url()

    # authorization_url, state = flow.authorization_url(
    #     # Enable offline access so that you can refresh an access token without
    #     # re-prompting the user for permission. Recommended for web server apps.
    #     access_type='offline',
    #     # Enable incremental authorization. Recommended as a best practice.
    #     include_granted_scopes='true')

    # Store the state so the callback can verify the auth server response.
    # flask.session['state'] = state

    return flask.redirect(authorization_url)


@app.route('/oauth2callback')
def oauth2callback():
    # Specify the state when creating the flow in the callback so that it can
    # verified in the authorization server response.
    # state = flask.session['state']

    flow = client.OAuth2WebServerFlow(client_id=CLIENT_ID,
                                        client_secret=CLIENT_SECRET,
                                        scope=SCOPES)

    flow.redirect_uri = flask.url_for('oauth2callback', _external=True)

    # Use the authorization server's response to fetch the OAuth 2.0 tokens.
    authorization_response = request.args.get('code')
    credentials = flow.step2_exchange(authorization_response)

    # Store credentials in the session.
    # ACTION ITEM: In a production app, you likely want to save these
    #              credentials in a persistent database instead.
    flask.session['credentials'] = credentials.to_json()

    return flask.redirect(flask.url_for('save_activity'))


if __name__ == '__main__':
    """ Starts the Flask development server. """
    # When running locally, disable OAuthlib's HTTPs verification.
    # ACTION ITEM for developers:
    #     When running in production *do not* leave this option enabled.
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

    app.debug = True
    app.host = '0.0.0.0'
    app.port = '5000'
    app.run()
