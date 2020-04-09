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

from functools import wraps

from flask import Flask, render_template, request, redirect, url_for
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


# Set up Google Constants
CLIENT_ID = client_id = os.environ['GOOGLE_CLIENT_ID']
CLIENT_SECRET = client_secret = os.environ['GOOGLE_CLIENT_SECRET']
SCOPES = ['https://www.googleapis.com/auth/calendar profile email']
API_SERVICE_NAME = 'calendar'
API_VERSION = 'v3'


@app.teardown_appcontext
def shutdown_session(exception=None):
    db.session.remove()


def login_required(f):
    """
        After decorating a function this function gets run before the decorated function.

        Checks if user_id is in flask.session. If not, redirects user to login page, else
        runs decorated function.
    """
    @wraps(f)
    # If the user is not logged in return them to the login page
    def decorated_function(*args, **kwargs):
        if 'user_id' not in flask.session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function


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
        flask.session['user_id'] = idinfo['sub']  # Get the permanent Google id
        flask.session['user_name'] = idinfo['name']
        flask.session['user_picture'] = idinfo['picture']
        flask.session['user_email'] = idinfo['email']

        user = get_or_create_user(db.session, User, idinfo['sub'])

        return redirect('/')

    return 'Error logging in, please try again.'


@app.route('/logout', methods=['POST'])
@login_required
def logout():
    """
        Logs the currently signed in user out.
    """
    flask.session.clear()

    return url_for('login')


@app.route('/api/start-activity', methods=['POST'])
@login_required
def update_activity():
    """
        Updates the server's records of which activity the user is currently doing.
    """
    user_id = flask.session['user_id']
    activity_id = request.form['activity_id']

    user = get_or_create_user(db.session, User, user_id)

    set_users_activity(
        session=db.session,
        model=User,
        user=user,
        activity_id=activity_id)

    return 'success'


@app.route('/api/stop-activity', methods=['POST'])
@login_required
def stop_activity():
    """
        Stops the user's current activity.

        Tries to get user_id from flask session (website version), if that fails this function
        gets user_id from request.get_json() (app version).
    """
    user_id = flask.session['user_id']

    user = get_or_create_user(db.session, User, user_id)

    stop_users_activity(
        session=db.session,
        model=User,
        user=user)

    return json.dumps({'code': 'success'})


@app.route('/api/save-activity', methods=['POST'])
@login_required
def save_activity():
    """
        TODO: Lots of room for improvement. This function works for both the app and website but
        all the code is duplicated for each case, this should be fixed to only separate the
        differences in the code and use the same code for the similarities.
    """
    user = get_or_create_user(db.session, User, flask.session['user_id'])

    return json.dumps(save_users_activity(db.session, User, Activity, user))


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
    user = get_or_create_user(db.session, User, flask.session['user_id'])
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
    user_id = flask.session['user_id']
    name = request.form['activity']
    color = request.form['color']

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
    activity_id = request.form['activity_id']
    new_color = request.form['new_color']
    new_name = request.form['new_name']

    # Get user's activities
    activities = Activity.query.filter_by(user_id=flask.session['user_id']).all()
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
    activity_id = request.form['activity_id']

    delete_users_activity(db.session, Activity, activity_id)

    return json.dumps('success')


@app.route('/api/list_events', methods=['POST'])
def list_events():
    data = request.get_json()
    startDateTime = data['startDateTime']
    endDateTime = data['endDateTime']

    user = get_or_create_user(db.session, User, flask.session['user_id'])

    return json.dumps(list_users_events(db.session, User, Activity, user, startDateTime, endDateTime))


@app.route('/api/timer_startup_payload', methods=['POST'])
def timer_startup_paytload():
    # Get user's list of activities from the database.
    user = get_or_create_user(db.session, User, flask.session['user_id'])
    activities = Activity.query.filter_by(user_id=user.id).order_by(Activity.id).all()

    # Decide whether there is a currently running activity
    if not user.started_at or not user.stopped_at:
        running = False
    else:
        running = user.stopped_at < user.started_at

    started_at = user.started_at
    current_activity_id = user.current_activity
    current_activity = Activity.query.filter_by(id=current_activity_id).first()

    current_activity = current_activity if current_activity else None


    serialized_activities = [ a.serialize for a in activities]

    payload = {
        'activities': serialized_activities,
        'running_activity': running,
        'start_time': str(started_at),
        'current_activity': current_activity.serialize
    }

    return json.dumps(payload)


# @app.route('/')
# @login_required
# def index():
#     """
#         Main page of the website. Gets user's current activity and list of activities, then
#         renders the template with this information.
#     """
#     # Get user's list of activities from the database.
#     user = get_or_create_user(db.session, User, flask.session['user_id'])
#     activities = Activity.query.filter_by(user_id=user.id).order_by(Activity.id).all()

#     # Decide whether there is a currently running activity
#     if not user.started_at or not user.stopped_at:
#         running = False
#     else:
#         running = user.stopped_at < user.started_at

#     started_at = user.started_at
#     current_activity_id = user.current_activity
#     current_activity = Activity.query.filter_by(id=current_activity_id).first()

#     current_activity = current_activity.name if current_activity else ''
    
#     now = datetime.utcnow()

#     return render_template(
#         "index.html",
#         activities=activities,
#         running_activity=running,
#         start_time=started_at,
#         now_time=str(now),
#         current_activity=current_activity)


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

    app.debug = True
    app.host = '0.0.0.0'
    app.port = '5000'
    app.run()
