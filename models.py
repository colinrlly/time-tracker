from sqlalchemy import Column, Integer, DateTime, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import JSON

from app import db


class UsersCurrentActivities(db.Model):
    """ Model to keep track of which user is doing which activity """

    __tablename__ = 'users_current_activities'

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False, unique=True)
    user = Column(String(255), nullable=False)
    activity = Column(String(255), nullable=False)
    started_at = Column(DateTime, nullable=False)
    stopped_at = Column(DateTime, nullable=True)

    def __init__(self, user, activity, started_at):
        self.user = user
        self.activity = activity
        self.started_at = started_at

    def __repr__(self):
        return '<Track:user %r, activity %r, updated_at %r, stopped_at %r>' % \
        (self.user, self.activity, self.updated_at, self.stopped_at)
