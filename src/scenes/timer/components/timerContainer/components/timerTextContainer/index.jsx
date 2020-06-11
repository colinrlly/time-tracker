import React from 'react';
import { useSelector } from 'react-redux';

import {
    TimerText,
} from './components';

function TimerTextContainer() {
    const lastActivityStartTime = useSelector((state) => state.lastActivityStartTime);
    const lastActivityStopTime = useSelector((state) => state.lastActivityStopTime);
    const activityIsRunning = useSelector((state) => state.activityIsRunning);
    const hasUnsavedActivityRecord = useSelector((state) => state.hasUnsavedActivityRecord);

    return (
        <TimerText
            lastActivityStartTime={lastActivityStartTime}
            lastActivityStopTime={lastActivityStopTime}
            runningActivity={activityIsRunning}
            hasUnsavedActivityRecord={hasUnsavedActivityRecord} />
    );
}

export default TimerTextContainer;
