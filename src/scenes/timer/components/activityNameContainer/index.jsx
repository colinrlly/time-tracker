import React from 'react';
import { useSelector } from 'react-redux';

import {
    ActivityName,
} from './components';

function ActivityNameContainer() {
    const activityIsRunning = useSelector((state) => state.activityIsRunning);
    const currentActivity = useSelector((state) => state.currentActivity);

    return activityIsRunning
        ? <ActivityName name={currentActivity.name} />
        : null;
}

export default ActivityNameContainer;
