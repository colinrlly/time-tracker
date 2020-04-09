import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';

import {
    NavBar,
} from '../../components';

import {
    TimerText,
} from './components';

function Timer() {
    const [activities, setActivities] = useState([]);
    const [currentActivity, setCurrentActivity] = useState({});
    const [runningActivity, setRunningActivity] = useState(false);
    const [lastActivityStartTime, setLastActivityStartTime] = useState(moment());
    const [displayedTime, setDisplayedTime] = useState(null);
    const [timerIntervalId, setTimerIntervalId] = useState(null);

    useEffect(() => {
        // Fetch the user's "startup payload" from the server.
        axios.post('/api/timer_startup_payload').then((response) => {
            setActivities(response.data.activities);
            setCurrentActivity(response.data.current_activity);
            setRunningActivity(response.data.running_activity);
            setLastActivityStartTime(moment(response.data.start_time));
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    useEffect(() => {
        if (runningActivity) {
            clearInterval(timerIntervalId);

            const diff = moment.utc() - lastActivityStartTime;
            const duration = moment.duration(diff, 'milliseconds');
            setDisplayedTime(moment.utc(duration.asMilliseconds()).format('HH:mm:ss'));

            setTimerIntervalId(setInterval(() => {
                duration.add(1, 'second');
                setDisplayedTime(moment.utc(duration.asMilliseconds()).format('HH:mm:ss'));
            }, 1000));
        } else {
            setDisplayedTime('00:00:00');
        }
    }, [currentActivity, lastActivityStartTime]);

    return (
        <div>
            <NavBar />
            <TimerText time={displayedTime} />
        </div >
    );
}

export default Timer;
