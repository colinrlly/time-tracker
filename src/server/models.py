from sqlalchemy import Column, Integer, DateTime, String, ForeignKey, BigInteger, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import JSON

from settings import db

class User(db.Model):
    """ Model to store a user. 
    
        One model to rule them all. This model holds the 
        user's profile information, current activity information,
        and Google credentials information.
        
        The id for this model is the users Google account id.
    """

    __tablename__ = 'user'

    id = Column(String(30), primary_key=True, nullable=False, unique=True)

    # related to activity
    current_activity = Column(Integer, nullable=True)  # Should be FK but I don't want to deal with that
    started_at = Column(DateTime, nullable=True)
    stopped_at = Column(DateTime, nullable=True)
    has_unsaved_activity_record = Column(Boolean, server_default="False", nullable=False)
    activity_is_running = Column(Boolean, server_default="False", nullable=False)

    # related to credentials
    credentials = Column(String(7000), nullable=True)


class Activity(db.Model):
    """ Model to store a users activities.

        Basically just a table of strings representing a User's list of activities
    """

    __tablename__ = 'activity'

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False, unique=True)
    user_id = Column(String(30), ForeignKey("user.id"), nullable=False)
    name = Column(String(255), nullable=False)
    color = Column(Integer, nullable=False)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'color': self.color,
        }
