import os
basedir = os.path.abspath(os.path.dirname(__file__))

DEBUG = True
TESTING = True
CSRF_ENABLED = True
SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
SQLALCHEMY_TRACK_MODIFICATIONS = False
TEMPLATES_AUTO_RELOAD = True