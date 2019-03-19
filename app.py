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

import json

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
SCOPES = ['https://www.googleapis.com/auth/calendar profile email']
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
    activities = Activity.query.filter_by(user_id=user.id).all()

    # Decide whether there is a currently running activity
    if not user.started_at or not user.stopped_at:
        running = False
    else:
        running = user.stopped_at < user.started_at
    
    started_at = user.started_at
    current_activity_id = user.current_activity
    current_activity = Activity.query.filter_by(id=current_activity_id).first()

    if current_activity:
        current_activity = current_activity.name
    else:
        current_activity = ''

    now = datetime.utcnow()

    return render_template(
            "index.html", 
            activities=activities, 
            running_activity=running,
            start_time=started_at,
            now_time=str(now),
            current_activity=current_activity)


@app.route('/login', methods=['GET'])
def login():
    """ Serves the login page if method is GET, if POST logs the user in. """
    if request.method == 'GET':
        redirectUrl = request.args.get('redirectUrl')

        if redirectUrl:
            flask.session['redirectUrl'] = redirectUrl
            flask.session['client'] = 'app'
        else:
            flask.session['client'] = 'web'

        return render_template('login.html')


@app.route('/logout', methods=['POST'])
@login_required
def logout():
    """ Logs the currently signed in user out. """
    flask.session.clear()

    return url_for('index')


@app.route('/api/start-activity', methods=['POST'])
# @login_required
def update_activity():
    """ Updates the servers records of which activity the user is currently doing. """
    try:
        user_id = flask.session['user_id']
        activity_id = request.form['activity_id']
    except:
        data = request.get_json()
        user_id = data['user_id']
        activity_id = data['activity_id']

    user = get_or_create_user(db.session, User, user_id)

    set_users_activity(
        session=db.session, 
        model=User, 
        user=user, 
        activity_id=activity_id)

    return 'success'


@app.route('/api/stop-activity', methods=['POST'])
# @login_required
def stop_activity():
    """ Stops the user's current activity """
    try:
        user_id = flask.session['user_id']
    except:
        user_id = request.get_json()['user_id']

    user = get_or_create_user(db.session, User, user_id)

    stop_users_activity(
        session=db.session,
        model=User,
        user=user)

    return 'success'


@app.route('/api/save-activity', methods=['GET', 'POST'])
# @login_required
def save_activity():
    if request.method == 'GET': # Request is coming from website
        user = get_or_create_user(db.session, User, flask.session['user_id'])

        if not user.credentials:
            return redirect('authorize')

        try:
            credentials = client.OAuth2Credentials.from_json(user.credentials)  # Load credentials from the database.
            
            if credentials.access_token_expired:
                credentials.refresh(Http())
        except HttpAccessTokenRefreshError:  # Google credentials were revoked, need to authorize again
            return redirect(url_for('authorize'))

        calendar = googleapiclient.discovery.build(
            API_SERVICE_NAME, API_VERSION, credentials=credentials)

        # Store credentials in the database.
        user.credentials = credentials.to_json()
        db.session.add(user)
        db.session.commit()

        successful = save_users_activity(
                        User,
                        Activity,
                        user,
                        calendar)
        
        if not successful:  # The Google credentials were revoked
            return redirect(url_for('authorize'))

        return redirect(url_for('index'))
    else:  # method is POST...request is coming from app
        no_credentials_error = json.dumps({'success': False, 'message': False })

        permanentId = request.get_json()['permanentId']

        user = get_or_create_user(db.session, User, permanentId)

        if not user.credentials:
            return no_credentials_error

        try:
            credentials = client.OAuth2Credentials.from_json(user.credentials)  # Load credentials from the database.
            
            if credentials.access_token_expired:
                credentials.refresh(Http())
        except HttpAccessTokenRefreshError:  # Google credentials were revoked, need to authorize again
            return no_credentials_error

        calendar = googleapiclient.discovery.build(
            API_SERVICE_NAME, API_VERSION, credentials=credentials)

        # Store credentials in the database.
        user.credentials = credentials.to_json()
        db.session.add(user)
        db.session.commit()

        successful = save_users_activity(
                        User,
                        Activity,
                        user,
                        calendar)
        
        if not successful:  # The Google credentials were revoked
            return no_credentials_error

        return json.dumps({'success': True})        


@app.route('/api/create-activity', methods=['POST'])
# @login_required
def create_activity():
    try:
        user_id = flask.session['user_id']
        name = request.form['activity']
        color = request.form['color']
    except:
        data = request.get_json()
        user_id = data['user_id']
        name = data['name']
        color = data['color']

    activities = Activity.query.filter_by(user_id=user_id).all()

    # convert list of objects to list of names
    names = [] 
    for x in activities:
        names.append(x.name)

    if name in names:  # If new activity is a duplicate
        return json.dumps({'success': 'false', 'activity_id': 'null'})
    else:
        activity = Activity(user_id=user_id, name=name, color=color)
        db.session.add(activity)
        db.session.commit()
        return json.dumps({'success': 'true', 'activity_id': activity.id})


@app.route('/api/get-current-activity', methods=['POST'])
# @login_required
def get_current_activity():
    user_id = request.get_json()['user_id']

    user = get_or_create_user(db.session, User, user_id)

    activity = get_users_current_activity(db.session, Activity, user)

    return json.dumps(activity)


@app.route('/api/get-all-activities', methods=['POST'])
# @login_required
def get_all_acitivities():
    user_id = request.get_json()['user_id']

    activities = get_all_users_activities(db.session, Activity, user_id)

    return json.dumps(activities)


@app.route('/api/delete-activity', methods=['POST'])
def delete_activity():
    activity_id = request.get_json()['activity_id']

    delete_users_activity(db.session, Activity, activity_id)

    return json.dumps('success')


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

    if flask.session['client'] == 'app':
        credentials = json.loads(credentials.to_json())

        url = '{redirectUrl}/--/?calendarEmail={calendar_email}'.format(
            redirectUrl = flask.session['redirectUrl'],
            calendar_email = credentials['id_token']['email'])

        return redirect(url)
    else:
        return redirect(url_for('save_activity'))


@app.route('/login_oauth_server_flow')
def login_oauth_server_flow():
    flow = client.OAuth2WebServerFlow(client_id=CLIENT_ID,
                                      client_secret=CLIENT_SECRET,
                                      scope='profile email')

    flow.redirect_uri = url_for('login_oauth2callback', _external=True)

    authorization_url = flow.step1_get_authorize_url()

    return redirect(authorization_url)


@app.route('/login_oauth2callback')
def login_oauth2callback():
    flow = client.OAuth2WebServerFlow(client_id=CLIENT_ID,
                                      client_secret=CLIENT_SECRET,
                                      scope='profile')

    flow.redirect_uri = url_for('login_oauth2callback', _external=True)

    authorization_response = request.args.get('code')
    login_credentials = flow.step2_exchange(authorization_response)
    token = json.loads(login_credentials.to_json())['id_token_jwt']
    idinfo = get_idinfo(token)  # Get the permanent Google profile dictionary

    if idinfo:
        flask.session['user_id'] = idinfo['sub']  # Get the permanent Google id
        flask.session['user_name'] = idinfo['name']
        flask.session['user_picture'] = idinfo['picture']
        flask.session['user_email'] = idinfo['email']

        user = get_or_create_user(db.session, User, idinfo['sub'])

        if flask.session['client'] == 'app':
            credentials = user.credentials

            if credentials:
                credentials = json.loads(credentials)

                temp = credentials.get('id_token', '').get('email', '')

                flask.session['calendar_email'] = temp

            return redirect(url_for('redirect_to_app'))
        else:
            return redirect(url_for('index'))

    return 'Error logging in, please try again.'


@app.route('/redirect-to-app')
def redirect_to_app():
    url = '{redirectUrl}/--/?userId={user_id}&userName={user_name}&userPicture={user_picture}&userEmail={user_email}&calendarEmail={calendar_email}'.format(
        redirectUrl = flask.session['redirectUrl'],
        user_id = flask.session['user_id'],
        user_name = flask.session['user_name'],
        user_picture = flask.session['user_picture'],
        user_email = flask.session['user_email'],
        calendar_email = flask.session['calendar_email'])

    return redirect(url)


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
