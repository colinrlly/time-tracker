import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import {
    utcNow,
} from '../../helpers';

import {
    setCurrentActivity,
    setActivityIsRunning,
    setLastActivityStartTime,
} from '../../../../redux/actions';

import { ActivityList } from './components';

function ActivityListContainer() {
    const allActivitiesList = useSelector((state) => state.allActivitiesList);
    const activityIsRunning = useSelector((state) => state.activityIsRunning);
    const dispatch = useDispatch();

    function handleActivityClick(activity) {
        if (!activityIsRunning) {
            dispatch(setCurrentActivity(activity));
            dispatch(setActivityIsRunning(true));
            dispatch(setLastActivityStartTime(utcNow()));

            axios.post('api/start-activity', {
                activity_id: activity.id,
            });
        }
    }

    return (
        <ActivityList
            activities={allActivitiesList}
            handleActivityClick={handleActivityClick}
            activityIsRunning={activityIsRunning} />
    );
}

export default ActivityListContainer;
