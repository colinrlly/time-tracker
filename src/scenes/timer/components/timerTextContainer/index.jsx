import React from 'react';
import { useSelector } from 'react-redux';

import {
    TimerText,
} from './components';

function TimerTextContainer() {
    const lastActivityStartTime = useSelector((state) => state.lastActivityStartTime);
    const activityIsRunning = useSelector((state) => state.activityIsRunning);

    return (
        <TimerText
            lastActivityStartTime={lastActivityStartTime}
            runningActivity={activityIsRunning} />
    );
}

export default TimerTextContainer;
