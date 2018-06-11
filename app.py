"""
    Created by Colin Reilly 5/23/18

    Main Flask server file. An app to log how long a user performs 
    a certain activity and then record the activity in Google Calendar.
"""

import os
import flask
from datetime import datetime
from httplib2 import Http

from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
import psycopg2

import google
from google.oauth2 import credentials, id_token
import google_auth_oauthlib.flow
import googleapiclient.discovery
from oauth2client import client
from google.auth.transport import requests

from oauth2client.client import credentials_from_code, AccessTokenCredentials

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
SCOPES = ['https://www.googleapis.com/auth/calendar profile']
API_SERVICE_NAME = 'calendar'
API_VERSION = 'v3'


@app.route('/')
def home():
    """ Renders the homepage template. """
    return render_template("index.html")


@app.route('/api/start-activity', methods=['POST'])
def update_activity():
    """ Updates the servers records of which activity the user is currently doing. """
    
    user = get_or_create_user(db.session, User, flask.session['user_id'])

    set_users_activity(
        session=db.session, 
        model=User, 
        user=user, 
        activity=request.form['activity'])

    return 'success'


@app.route('/api/stop-activity', methods=['POST'])
def stop_activity():
    """ Stops the user's current activity """
    user = get_or_create_user(db.session, User, flask.session['user_id'])

    stop_users_activity(
        session=db.session,
        model=User,
        user=user)

    return 'success'


@app.route('/api/verify-and-login', methods=['POST'])
def verify_id_token():
    token = request.form['token']

    idinfo = get_idinfo(token)

    if idinfo:
        flask.session['user_id'] = idinfo['sub']
        print(flask.session)
        return 'success'

    return 'error'


@app.route('/api/save-activity')
def save_activity():
    user = get_or_create_user(db.session, User, flask.session['user_id'])

    if not user.credentials:
        return flask.redirect('authorize')

    # Load credentials from the database.
    credentials = client.OAuth2Credentials.from_json(user.credentials)

    if credentials.access_token_expired:
        credentials.refresh(Http())

    calendar = googleapiclient.discovery.build(
        API_SERVICE_NAME, API_VERSION, credentials=credentials)

    # Store credentials in the database.
    user.credentials = credentials.to_json()
    db.session.add(user)
    db.session.commit()

    save_users_activity(
        User,
        user,
        calendar)

    return flask.redirect(flask.url_for('home'))


@app.route('/authorize')
def authorize():
    # Create flow instance to manage the OAuth 2.0 Authorization Grant Flow steps.
    flow = client.OAuth2WebServerFlow(client_id=CLIENT_ID,
                                      client_secret=CLIENT_SECRET,
                                      scope=SCOPES,
                                      access_type='offline',
                                      prompt='consent')

    flow.redirect_uri = flask.url_for('oauth2callback', _external=True)

    authorization_url = flow.step1_get_authorize_url()

    return flask.redirect(authorization_url)


@app.route('/oauth2callback')
def oauth2callback():
    flow = client.OAuth2WebServerFlow(client_id=CLIENT_ID,
                                      client_secret=CLIENT_SECRET,
                                      scope=SCOPES)

    flow.redirect_uri = flask.url_for('oauth2callback', _external=True)

    # Use the authorization server's response to fetch the OAuth 2.0 tokens.
    authorization_response = request.args.get('code')
    credentials = flow.step2_exchange(authorization_response)

    # Store credentials in the database.
    user = get_or_create_user(db.session, User, flask.session['user_id'])
    user.credentials = credentials.to_json()
    db.session.add(user)
    db.session.commit()

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
