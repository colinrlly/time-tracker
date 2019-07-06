"""
    Created by Colin Reilly 5/23/18

    Main Flask server file. An app to log how long a user performs 
    a certain activity and then record the activity in Google Calendar.
"""

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


###########################################
########## Only Used in Website ###########
###########################################


@app.route('/')
@login_required
def index():
    """
        Main page of the website. Gets user's current activity and list of activities, then
        renders the template with this information.
    """
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

    current_activity = current_activity.name if current_activity else ''
    
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
    """
        Serves the login page if method is GET, if POST logs the user in.
    """
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
    """
        Logs the currently signed in user out.
    """
    flask.session.clear()

    return url_for('index')


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


###################################################
########## Used in Both Website and App ###########
###################################################


@app.route('/api/start-activity', methods=['POST'])
@login_required
def update_activity():
    """
        Updates the server's records of which activity the user is currently doing.

        Tries to get information from the flask session (website version), if that is
        not possible this function gets information from the object returned from
        request.get_json (comming from app).
    """
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
@login_required
def stop_activity():
    """
        Stops the user's current activity.

        Tries to get user_id from flask session (website version), if that fails this function
        gets user_id from request.get_json() (app version).
    """
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
@login_required
def save_activity():
    """
        TODO: Lots of room for improvement. This function works for both the app and website but
        all the code is duplicated for each case, this should be fixed to only separate the
        differences in the code and use the same code for the similarities.
    """
    if request.method == 'GET':  # Request is coming from website
        user = get_or_create_user(db.session, User, flask.session['user_id'])

        if not user.credentials:
            return redirect('authorize')

        try:
            # Load credentials from the database.
            credentials = client.OAuth2Credentials.from_json(user.credentials)

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
        no_credentials_error = json.dumps({'success': False, 'message': False})

        permanentId = request.get_json()['permanentId']

        user = get_or_create_user(db.session, User, permanentId)

        if not user.credentials:
            return no_credentials_error

        try:
            # Load credentials from the database.
            credentials = client.OAuth2Credentials.from_json(user.credentials)

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
@login_required
def create_activity():
    """
        Gets new activity information either from flask sesion for website or request.get_json()
        for app. Attempts to add a new activity for the user. Will return success: false if
        the activity name is a duplicate.

        Returns object of shape { 'success': 'true'/'false', 'activity_id': int }
    """
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

    if str.lstrip(name) == '':
        return json.dumps({'code': 'empty'})
    if name in names:  # If new activity is a duplicate
        return json.dumps({'code': 'duplicate'})
    
    activity = Activity(user_id=user_id, name=name, color=color)
    db.session.add(activity)
    db.session.commit()
    return json.dumps({'code': 'success', 'activity_id': activity.id})


@app.route('/api/save-activity-edit', methods=['POST'])
@login_required
def save_activity_edit():
    activity_id = request.form['activity_id']
    new_color = request.form['new_color']
    new_name = request.form['new_name']

    activities = Activity.query.filter_by(user_id=flask.session['user_id']).all()
    activity = Activity.query.get(activity_id)

    # convert list of objects to list of names
    names = []
    for x in activities:
        if x.name != activity.name:
            names.append(x.name)

    if str.lstrip(new_name) == '':
        return json.dumps({'code': 'empty'})
    if new_name in names:  # If new activity is a duplicate
        return json.dumps({'code': 'duplicate'})

    edit_users_activity(db.session, Activity, activity_id, new_name, new_color)
    return json.dumps({'code': 'success'});


@app.route('/api/delete-activity', methods=['POST'])
def delete_activity():
    """
        Deletes a user's activity.

        TODO: What happens if the activity we try to delete doesn't exist?
    """
    activity_id = request.form['activity_id']

    delete_users_activity(db.session, Activity, activity_id)

    return json.dumps('success')


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

    if flask.session['client'] == 'app':
        credentials = json.loads(credentials.to_json())

        url = '{redirectUrl}/--/?calendarEmail={calendar_email}'.format(
            redirectUrl=flask.session['redirectUrl'],
            calendar_email=credentials['id_token']['email'])

        return redirect(url)
    else:
        return redirect(url_for('save_activity'))


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


#######################################
########## Used in Only App ###########
#######################################


@app.route('/api/get-current-activity', methods=['POST'])
# @login_required
def get_current_activity():
    """
        Returns a user's currently running activity in the following form...

        If user has a current activity:
        {
            "success": True,
            "started_at": started_at,
            "stopped_at": stopped_at,
            "name": name,
            "color": color
        }

        If user doesn't have a current acitity:
        {
            "success": False
        }
    """
    user_id = request.get_json()['user_id']

    user = get_or_create_user(db.session, User, user_id)

    activity = get_users_current_activity(db.session, Activity, user)

    return json.dumps(activity)


@app.route('/api/get-all-activities', methods=['POST'])
# @login_required
def get_all_acitivities():
    """
        returns all acitivties belonging to a user.
    """
    user_id = request.get_json()['user_id']

    activities = get_all_users_activities(db.session, Activity, user_id)

    return json.dumps(activities)


@app.route('/redirect-to-app')
def redirect_to_app():
    """
        Uses deep linking to redirect back into the Log app.

        Normally this redirect url is sent to the server whenever the app makes a request. This
        url is then saved in the flask session in order to redirect the user back into the app.
    """
    url = '{redirectUrl}/--/?userId={user_id}&userName={user_name}&userPicture={user_picture}&userEmail={user_email}&calendarEmail={calendar_email}'.format(
        redirectUrl=flask.session['redirectUrl'],
        user_id=flask.session['user_id'],
        user_name=flask.session['user_name'],
        user_picture=flask.session['user_picture'],
        user_email=flask.session['user_email'],
        calendar_email=flask.session['calendar_email'])

    return redirect(url)


@app.route('/exchange-auth-code', methods=['POST'])
def exchange_auth_code():
    """
        Exchange auth code from from app for google calendar credentials.
    """
    # (Receive auth_code by HTTPS POST)
    permanent_id = request.get_json()['permanent_id']
    server_auth_code = request.get_json()['server_auth_code']

    # TODO: We need to think about security...
    # If this request does not have `X-Requested-With` header, this could be a CSRF
    # if not request.headers.get('X-Requested-With'):
    #     return 'Request blocked for possible CSRF'

    # Exchange auth code for access token, refresh token, and ID token
    credentials = client.credentials_from_code(
        '274906250371-drutiad43iut8ctu257cmi3bip3c02ac.apps.googleusercontent.com',
        '7ogPXOYKaVJZbFX_acNhem-8',
        ['https://www.googleapis.com/auth/calendar'],
        server_auth_code,
        redirect_uri=url_for('exchange_auth_code', _external=True))

    # Store credentials in the database.
    user = get_or_create_user(db.session, User, permanent_id)
    user.credentials = credentials.to_json()
    db.session.add(user)
    db.session.commit()

    return 'success'

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
