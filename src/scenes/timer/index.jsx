import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

import { useSelector } from 'react-redux';

import {
    NavBar,
} from '../../components';

import {
    TimerText,
    ActivityList,
    StartupPayloadFetcher,
} from './components';

function Timer() {
    // const [activities, setActivities] = useState([]);
    const [currentActivity, setCurrentActivity] = useState({});
    const [runningActivity, setRunningActivity] = useState(false);
    const [lastActivityStartTime, setLastActivityStartTime] = useState(moment());

    const allActivitiesList = useSelector((state) => state.allActivitiesList);

    useEffect(() => {
        // Fetch the user's "startup payload" from the server.
        axios.post('/api/timer_startup_payload').then((response) => {
            // setActivities(response.data.activities);
            setCurrentActivity(response.data.current_activity);
            setRunningActivity(response.data.running_activity);
            setLastActivityStartTime(moment(response.data.start_time));
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    return (
        <div>
            <StartupPayloadFetcher />
            <NavBar />
            <TimerText
                lastActivityStartTime={lastActivityStartTime}
                runningActivity={runningActivity} />
            <ActivityList activities={allActivitiesList} />
        </div >
    );
}

export default Timer;
