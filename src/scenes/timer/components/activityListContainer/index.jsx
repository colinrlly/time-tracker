import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

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
            dispatch(setLastActivityStartTime(moment()));
        }
    }

    return (
        <ActivityList
            activities={allActivitiesList}
            handleActivityClick={handleActivityClick} />
    );
}

export default ActivityListContainer;
