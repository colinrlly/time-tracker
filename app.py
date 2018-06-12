"""
    Created by Colin Reilly 5/23/18

    Main Flask server file. An app to log how long a user performs 
    a certain activity and then record the activity in Google Calendar.
"""

import os
import flask
from datetime import datetime
from httplib2 import Http

from functools import wraps

from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
import psycopg2

import google
from google.oauth2 import credentials, id_token
import google_auth_oauthlib.flow
import googleapiclient.discovery
from oauth2client import client
from google.auth.transport import requests

from oauth2client.client import credentials_from_code, AccessTokenCredentials, HttpAccessTokenRefreshError

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


@app.teardown_appcontext
def shutdown_session(exception=None):
    db.session.remove()


def login_required(f):
    @wraps(f)
    # If the user is not logged in return them to the login page
    def decorated_function(*args, **kwargs):
        if 'user_id' not in flask.session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function


@app.route('/')
@login_required
def index():
    # Get user's list of activities from the database.
    user = get_or_create_user(db.session, User, flask.session['user_id'])
    activities = Activities.query.filter_by(user_id=user.id).all()

    # Decide whether there is a currently running activity
    if user.started_at:
        running = user.stopped_at < user.started_at
    else:
        running = False

    started_at = user.started_at
    current_activity = user.current_activity    

    now = datetime.utcnow()

    return render_template(
        "index.html", 
        activities=activities, 
        running_activity=running,
        start_time=started_at,
        now_time=str(now),
        current_activity=current_activity)


@app.route('/login', methods=['GET', 'POST'])
def login():
    """ Serves the login page if method is GET, if POST logs the user in. """
    if request.method == 'GET':
        return render_template('login.html')
    else:  # method is POST
        token = request.form['token']  # Get the temporary id token

        idinfo = get_idinfo(token)  # Get the permanent Google profile dictionary

        if idinfo:
            flask.session['user_id'] = idinfo['sub']  # Get the permanent Google id
            return url_for('index')

        return 'error'


@app.route('/logout', methods=['POST'])
@login_required
def logout():
    """ Logs the currently signed in user out. """
    flask.session.clear()

    return url_for('index')


@app.route('/api/start-activity', methods=['POST'])
@login_required
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
@login_required
def stop_activity():
    """ Stops the user's current activity """
    user = get_or_create_user(db.session, User, flask.session['user_id'])

    stop_users_activity(
        session=db.session,
        model=User,
        user=user)

    return 'success'


@app.route('/api/save-activity')
@login_required
def save_activity():
    user = get_or_create_user(db.session, User, flask.session['user_id'])

    if not user.credentials:
        return redirect('authorize')

    try:
        credentials = client.OAuth2Credentials.from_json(user.credentials)  # Load credentials from the database.
    except HttpAccessTokenRefreshError:  # Google credentials were revoked, need to authorize again
        return redirect(url_for('authorize'))

    if credentials.access_token_expired:
        credentials.refresh(Http())

    calendar = googleapiclient.discovery.build(
        API_SERVICE_NAME, API_VERSION, credentials=credentials)

    # Store credentials in the database.
    user.credentials = credentials.to_json()
    db.session.add(user)
    db.session.commit()

    successful = save_users_activity(
                    User,
                    user,
                    calendar)
    
    if not successful:  # The Google credentials were revoked
        return redirect(url_for('authorize'))

    return redirect(url_for('index'))


@app.route('/api/create-activity', methods=['POST'])
@login_required
def create_activity():
    user = get_or_create_user(db.session, User, flask.session['user_id'])

    activity = Activities(user_id=user.id, name=request.form['activity'])
    db.session.add(activity)
    db.session.commit()

    return 'created'


@app.route('/authorize')
@login_required
def authorize():
    # Create flow instance to manage the OAuth 2.0 Authorization Grant Flow steps.
    flow = client.OAuth2WebServerFlow(client_id=CLIENT_ID,
                                      client_secret=CLIENT_SECRET,
                                      scope=SCOPES,
                                      access_type='offline',
                                      prompt='consent')

    flow.redirect_uri = url_for('oauth2callback', _external=True)

    authorization_url = flow.step1_get_authorize_url()

    return redirect(authorization_url)


@app.route('/oauth2callback')
@login_required
def oauth2callback():
    flow = client.OAuth2WebServerFlow(client_id=CLIENT_ID,
                                      client_secret=CLIENT_SECRET,
                                      scope=SCOPES)

    flow.redirect_uri = url_for('oauth2callback', _external=True)

    # Use the authorization server's response to fetch the OAuth 2.0 tokens.
    authorization_response = request.args.get('code')
    credentials = flow.step2_exchange(authorization_response)

    # Store credentials in the database.
    user = get_or_create_user(db.session, User, flask.session['user_id'])
    user.credentials = credentials.to_json()
    db.session.add(user)
    db.session.commit()

    return redirect(url_for('save_activity'))


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
