from sqlalchemy import Column, Integer, DateTime, String, ForeignKey, BigInteger
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import JSON

from app import db

class User(db.Model):
    """ Model to store a user. 
    
        One model to rule them all. This model holds the 
        user's profile information, current activity information,
        and Google credentials information.
        
        The id for this model is the users Google account id.
    """

    __tablename__ = 'user'

    id = Column(String(30), primary_key=True, nullable=False, unique=True)
    email = Column(String(255), nullable=True)
    name = Column(String(255), nullable=True)
    picture = Column(String(2000), nullable=True)  # 2000 characters is max URL length
    given_name = Column(String(255), nullable=True)
    family_name = Column(String(255), nullable=True)
    locale = Column(String(10), nullable=True)

    # related to activity
    current_activity = Column(Integer, nullable=True)  # Should be FK but I don't want to deal with that
    started_at = Column(DateTime, nullable=True)
    stopped_at = Column(DateTime, nullable=True)

    # related to credentials
    refresh_token = Column(String(255), nullable=True)
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
