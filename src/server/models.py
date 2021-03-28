from sqlalchemy import Column, Integer, DateTime, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from flask_login import UserMixin

from settings import db

class User(UserMixin, db.Model):
    """ Model to store a user. 
    
        One model to rule them all. This model holds the 
        user's profile information, current activity information,
        and Google credentials information.
        
        The id for this model is the users Google account id.
    """

    __tablename__ = 'user'

    # Premium constants
    PREMIUM_SUBSCRIPTION = 'premium'

    id = Column(String(30), primary_key=True, nullable=False, unique=True)

    current_activity = Column(Integer, nullable=True)  # Should be FK but I don't want to deal with that
    started_at = Column(DateTime, nullable=True)
    stopped_at = Column(DateTime, nullable=True)
    has_unsaved_activity_record = Column(Boolean, server_default="False", nullable=False)
    activity_is_running = Column(Boolean, server_default="False", nullable=False)
    timezone = Column(String(50), nullable=True)
    credentials = Column(String(7000), nullable=True)
    stripe_customer_id = Column(String(25), nullable=True, unique=True)
    open_stripe_sessions = relationship('OpenStripeSession', back_populates="user")
    premium_subscription = Column(String(50), nullable=True)
    subscription_end = Column(DateTime, nullable=True)


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


class OpenStripeSession(db.Model):
    """ Model to store open Stripe sessions
    """

    __tablename__ = 'open_stripe_session'

    session_id = Column(String(100), primary_key=True, nullable=False, unique=True)
    user_id = Column(String(30), ForeignKey("user.id"), nullable=False)
    user = relationship('User', back_populates='open_stripe_sessions')
