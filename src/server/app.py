"""
    Created by Colin Reilly 5/23/18

    Main Flask server file. An app to log how long a user performs 
    a certain activity and then record the activity in Google Calendar.
"""
import sys
# sys.path.append('./src/server')

from models import *

import os
import flask
from datetime import datetime
from httplib2 import Http
from flask_login import login_user, LoginManager, current_user, logout_user, login_required

from functools import wraps

from flask import Flask, render_template, request, redirect, url_for, jsonify
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
from settings import app, db


# Set up flask_login
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

@login_manager.unauthorized_handler
def unauthorized_handler():
    return redirect(url_for('login'))


# Set up Google Constants
CLIENT_ID = client_id = os.environ['GOOGLE_CLIENT_ID']
CLIENT_SECRET = client_secret = os.environ['GOOGLE_CLIENT_SECRET']
SCOPES = ['https://www.googleapis.com/auth/calendar profile email']
API_SERVICE_NAME = 'calendar'
API_VERSION = 'v3'


@app.teardown_appcontext
def shutdown_session(exception=None):
    db.session.remove()


@app.route('/login', methods=['GET'])
def login():
    """
        Serves the login page.
    """
    return render_template('login.html')


@app.route('/login_oauth_server_flow')
def login_oauth_server_flow():
    """
        Redirects the user to a page to select a Google profile.

        Note: Redirects the current window, does not open up a new window. This is called
        Google oauth "server flow", as opposed to "web flow".
    """
    flow = client.OAuth2WebServerFlow(client_id=CLIENT_ID,
                                      client_secret=CLIENT_SECRET,
                                      scope='profile email')

    flow.redirect_uri = url_for('login_oauth2callback', _external=True)

    authorization_url = flow.step1_get_authorize_url()

    return redirect(authorization_url)


@app.route('/login_oauth2callback')
def login_oauth2callback():
    """
        TODO: More thought needs to be put into these google flows once the app
        google flows are finalized.
    """
    flow = client.OAuth2WebServerFlow(client_id=CLIENT_ID,
                                      client_secret=CLIENT_SECRET,
                                      scope='profile')

    flow.redirect_uri = url_for('login_oauth2callback', _external=True)

    authorization_response = request.args.get('code')
    login_credentials = flow.step2_exchange(authorization_response)
    token = json.loads(login_credentials.to_json())['id_token_jwt']
    idinfo = get_idinfo(token)  # Get the permanent Google profile dictionary

    if idinfo:
        user = get_or_create_user(db.session, User, idinfo['sub'])

        login_user(user, remember=True)

        return redirect('/')

    return 'Error logging in, please try again.'


@app.route('/logout', methods=['GET'])
@login_required
def logout():
    """
        Logs the currently signed in user out.
    """
    logout_user()

    return redirect(url_for('login'))


@app.route('/api/start-activity', methods=['POST'])
@login_required
def update_activity():
    """
        Updates the server's records of which activity the user is currently doing.
    """
    activity_id = request.get_json()['activity_id']
    # activity_id = request.form['activity_id']

    user = current_user

    set_users_activity(
        session=db.session,
        model=User,
        user=user,
        activity_id=activity_id)

    return jsonify({'code': 'success'})


@app.route('/api/stop-activity', methods=['POST'])
@login_required
def stop_activity():
    """
        Stops the user's current activity.
    """
    user = current_user

    stopped_at = stop_users_activity(
        session=db.session,
        model=User,
        user=user)

    return jsonify({'code': 'success', 'stop_time': str(stopped_at)})


@app.route('/api/save-activity', methods=['POST'])
@login_required
def save_activity():
    user = current_user

    return jsonify(save_users_activity(db.session, User, Activity, user))


@app.route('/api/delete-activity-record', methods=['POST'])
@login_required
def delete_activity_record():
    user = current_user

    delete_users_activity_record(
        session=db.session,
        model=User,
        user=user,
    )

    return jsonify({'code': 'success'})


@app.route('/authorize')
@login_required
def authorize():
    """
        Redirects the user to a page to select a Google profile.

        Note: Opens a new window. This is called
        Google oauth "web flow", as opposed to "server flow".

        TODO: More thought needs to be put into these google flows once the app
        google flows are finalized.
    """
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
    """
        TODO: More thought needs to be put into these google flows once the app
        google flows are finalized.
    """
    flow = client.OAuth2WebServerFlow(client_id=CLIENT_ID,
                                      client_secret=CLIENT_SECRET,
                                      scope=SCOPES)

    flow.redirect_uri = url_for('oauth2callback', _external=True)

    # Use the authorization server's response to fetch the OAuth 2.0 tokens.
    authorization_response = request.args.get('code')
    credentials = flow.step2_exchange(authorization_response)

    # Store credentials in the database.
    user = current_user
    user.credentials = credentials.to_json()
    db.session.add(user)
    db.session.commit()

    save_users_activity(db.session, User, Activity, user)

    return redirect('/')


@app.route('/api/create-activity', methods=['POST'])
@login_required
def create_activity():
    """
        Gets new activity information either from flask sesion for website or request.get_json()
        for app. Attempts to add a new activity for the user. Will return success: false if
        the activity name is a duplicate.

        Returns object of shape { 'success': 'true'/'false', 'activity_id': int }
    """
    user_id = current_user.get_id()
    name = request.get_json()['name']
    color = request.get_json()['color']

    activities = Activity.query.filter_by(user_id=user_id).all()

    # convert list of objects to list of names
    names = []
    for x in activities:
        names.append(x.name)

    if str.lstrip(name) == '':
        return json.dumps({'code': 'empty'})
    if name in names:  # If new activity is a duplicate
        return json.dumps({'code': 'duplicate'})
    
    activity = Activity(user_id=user_id, name=name, color=color)
    db.session.add(activity)
    db.session.commit()
    return json.dumps({'code': 'success', 'activity_id': activity.id})


@app.route('/api/edit-activity', methods=['POST'])
@login_required
def save_activity_edit():
    """
        Edits a user's activity.

        Return:
        {'code': 'empty'} if new activity name is empty  
        {'code': 'duplicate'} if new activity name is a duplicate
        {'code': 'success'} if activity was succesfully edited
    """
    activity_id = request.get_json()['activity_id']
    new_color = request.get_json()['new_color']
    new_name = request.get_json()['new_name']

    # Get user's activities
    activities = Activity.query.filter_by(user_id=current_user.get_id()).all()
    activity = Activity.query.get(activity_id)

    # convert list of objects to list of names
    # list of names is used to check if new name is duplicate
    names = []
    for x in activities:
        if x.name != activity.name:
            names.append(x.name)

    # Check if duplicate or empty name
    if str.lstrip(new_name) == '':
        return json.dumps({'code': 'empty'})
    if new_name in names:
        return json.dumps({'code': 'duplicate'})

    edit_users_activity(db.session, Activity, activity_id, new_name, new_color)
    return json.dumps({'code': 'success'})


@app.route('/api/delete-activity', methods=['POST'])
def delete_activity():
    """
        Deletes a user's activity.

        TODO: What happens if the activity we try to delete doesn't exist?
    """
    activity_id = request.get_json()['activity_id']

    delete_users_activity(db.session, Activity, activity_id)

    return json.dumps({'code': 'success'})


@app.route('/api/list_events', methods=['POST'])
def list_events():
    data = request.get_json()
    startDateTime = data['startDateTime']
    endDateTime = data['endDateTime']

    user = current_user

    return json.dumps(list_users_events(db.session, User, Activity, user, startDateTime, endDateTime))


@app.route('/api/timer_startup_payload', methods=['POST'])
def timer_startup_paytload():
    user = current_user
    activities = Activity.query.filter_by(user_id=user.get_id()).order_by(Activity.id).all()

    current_activity_id = user.current_activity
    current_activity = Activity.query.filter_by(id=current_activity_id).first()

    current_activity = current_activity.serialize if current_activity else None

    serialized_activities = [ a.serialize for a in activities]

    payload = {
        'activities': serialized_activities,
        'running_activity': user.activity_is_running,
        'has_unsaved_activity_record': user.has_unsaved_activity_record,
        'start_time': str(user.started_at),
        'stop_time': str(user.stopped_at),
        'current_activity': current_activity
    }

    return json.dumps(payload)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
@login_required
def catch_all(path):
    return render_template('data.html')


if __name__ == '__main__':
    """ Starts the Flask development server. """
    # When running locally, disable OAuthlib's HTTPs verification.
    # ACTION ITEM for developers:
    #     When running in production *do not* leave this option enabled.
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

    app.debug = False
    app.host = '0.0.0.0'
    app.port = '5000'
    app.run()
