import React from 'react';
import { useSelector } from 'react-redux';

import {
    ActivityName,
} from './components';

function ActivityNameContainer() {
    const activityIsRunning = useSelector((state) => state.activityIsRunning);
    const currentActivity = useSelector((state) => state.currentActivity);

    return <ActivityName name={currentActivity.name} activityIsRunning={activityIsRunning} />;
}

export default ActivityNameContainer;
