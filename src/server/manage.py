"""
    Two commands to use this file:
        1. python ./manage.py db migrate - this generates the migration file.
        2. python ./manage.py db upgrade head - this executes the changes in the database.
"""

import os
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

from app import app, db

migrate = Migrate(app, db)
manager = Manager(app)

manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()
