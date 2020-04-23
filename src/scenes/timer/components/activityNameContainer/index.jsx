import React from 'react';
import { useSelector } from 'react-redux';

import {
    ActivityName,
} from './components';

function ActivityNameContainer() {
    const activityIsRunning = useSelector((state) => state.activityIsRunning);
    const hasUnsavedActivityRecord = useSelector((state) => state.hasUnsavedActivityRecord);
    const currentActivity = useSelector((state) => state.currentActivity);

    return (activityIsRunning || hasUnsavedActivityRecord)
        ? <ActivityName
            name={currentActivity.name}
            hasUnsavedActivityRecord={hasUnsavedActivityRecord} />
        : null;
}

export default ActivityNameContainer;
