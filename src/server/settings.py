import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

instance_location = os.path.abspath('instance')
template_location = os.path.abspath('../templates')
static_location = os.path.abspath('../static')
app = Flask(__name__, 
    instance_path = instance_location,
    instance_relative_config = True,
    template_folder = template_location,
    static_folder = static_location
)
app.config.from_pyfile('development.py')
db = SQLAlchemy(app)
app.secret_key = os.environ['FLASK_SECRET_KEY']
