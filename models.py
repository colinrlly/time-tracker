from datetime import datetime
from sqlalchemy.sql import func
from app import db
from sqlalchemy.dialects.postgresql import JSON


class UsersCurrentActivities(db.Model):
    """ Model to keep track of which user is doing which activity """

    __tablename__ = 'users_current_activities'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False, unique=True)
    user = db.Column(db.String(255), nullable=False)
    activity = db.Column(db.String(255), nullable=False)
    updated_at = db.Column(db.DateTime, nullable=False, default=func.now(), onupdate=func.now())

    def __init__(self, user, activity):
        self.user = user
        self.activity = activity

    def __repr__(self):
        return '<Track:user %r, activity %r, updated_at %r>' % (self.user, self.activity, self.updated_at)
