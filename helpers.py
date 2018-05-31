from datetime import datetime

def set_users_activity(session, model, user, activity):
    """ In the database @session, sets or creates @user's current @activity """
    instance = model.query.filter_by(user=user).first()
    if instance:
        instance.activity = activity
        instance.started_at = datetime.utcnow()
        session.add(instance)
        session.commit()
        return 'updated'
    else:
        instance = model(user=user, activity=activity, started_at=datetime.utcnow())
        session.add(instance)
        session.commit()
        return 'created'


def stop_users_activity(session, model, user):
    """ In the database @session, stops @user's current @activity """

    instance = model.query.filter_by(user=user).first()
    instance.stopped_at = datetime.utcnow()
    session.add(instance)
    session.commit()

    return 'stopped'