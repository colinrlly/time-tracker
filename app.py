"""
    Created by Colin Reilly 5/23/18

    Main Flask server file. An app to log how long a user performs 
    a certain activity and then record the activity in Google Calendar.
"""

import os

from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
import psycopg2

from helpers import *

app = Flask(__name__, instance_relative_config=True)
app.config.from_pyfile('development.py')
db = SQLAlchemy(app)

from models import *


@app.route('/')
def hello_world():
    """ Renders the homepage template. """
    return render_template("index.html")


@app.route('/api/update-activity', methods=['POST'])
def update_activity():
    """ Updates the servers records of which activity the user is currently doing. """
    
    set_users_activity(db.session, 
        UsersCurrentActivities, 
        user="colin", 
        activity=request.form['activity'])

    return 'success'


@app.route('/api/stop-activity', methods=['POST'])
def stop_activity():
    """ Stops the user's current activity """

    stop_users_activity(db.session,
        UsersCurrentActivities,
        user="colin")

    return 'success'

if __name__ == '__main__':
    """ Starts the Flask development server. """
    app.debug = True
    app.host = '0.0.0.0'
    app.port = '5000'
    app.run()
