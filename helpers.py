def set_users_activity(session, model, user, activity):
    instance = model.query.filter_by(user=user).first()
    if instance:
        instance.activity = activity
        session.add(instance)
        session.commit()
        return 'updated'
    else:
        instance = model(user=user, activity=activity)
        session.add(instance)
        session.commit()
        return 'created'
