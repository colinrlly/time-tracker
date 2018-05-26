"""
    Created by Colin Reilly 5/23/18

    Main Flask server file. An app to log how long a user performs 
    a certain activity and then record the activity in Google Calendar.
"""

import os

from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
import psycopg2

from helpers import set_users_activity

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
        user="maggie", 
        activity=request.form['activity'])

    return 'success'


if __name__ == '__main__':
    """ Starts the Flask development server. """
    app.debug = True
    app.host = '0.0.0.0'
    app.port = '5000'
    app.run()
