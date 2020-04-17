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
    const hasUnsavedActivityRecord = useSelector((state) => state.hasUnsavedActivityRecord);
    const activityDialogDisplayed = useSelector((state) => state.activityDialog.displayed);
    const dispatch = useDispatch();

    function handleActivityClick(activity) {
        if (!activityIsRunning) {
            axios.post('api/start-activity', {
                activity_id: activity.id,
            }).then((response) => {
                if (response.data.code === 'success') {
                    dispatch(setCurrentActivity(activity));
                    dispatch(setActivityIsRunning(true));
                    dispatch(setLastActivityStartTime(utcNow()));
                } else {
                    console.error('problem starting activity');
                }
            });
        }
    }

    return (
        <ActivityList
            activities={allActivitiesList}
            handleActivityClick={handleActivityClick}
            hasUnsavedActivityRecord={hasUnsavedActivityRecord}
            activityIsRunning={activityIsRunning}
            disabled={activityDialogDisplayed} />
    );
}

export default ActivityListContainer;
