import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
# from flask_cors import CORS

app = Flask(__name__, instance_relative_config=True)
# cors = CORS(app)
app.config.from_pyfile('development.py')
db = SQLAlchemy(app)
app.secret_key = os.environ['FLASK_SECRET_KEY']
