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
    useEffect(() => {
        // Fetch the user's "startup payload" from the server.
        axios.post('/api/timer_startup_payload').then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    // const [time, setTime] = useState(0);
    // const [intervalId, setIntervalId] = useState(null);

    // const startTimer = (startTime) => {
    //     if (!timer) {
    //         const now = moment(utcNow());
    //         startTime = moment(startTime)
    //         let diff = now - startTime;
    //         let interval = 1000;
    //         let duration = moment.duration(diff, 'milliseconds');

    //         const timer = setInterval(() => {
    //             const seconds = ('0' + duration.seconds()).substr(-2, 2);
    //             const minutes = ('0' + duration.minutes()).substr(-2, 2);
    //             const hours = ('0' + duration.hours()).substr(-2, 2);
    //             const t = hours + ':' + minutes + ':' + seconds;

    //             $('p.time').html(t);
    //             duration = moment.duration(duration + interval, 'milliseconds');
    //         }, interval);
    //     }
    // };

    // function utcNow() {
    //     const d = new Date();

    //     return new Date(
    //         d.getUTCFullYear(),
    //         d.getUTCMonth(),
    //         d.getUTCDate(),
    //         d.getUTCHours(),
    //         d.getUTCMinutes(),
    //         d.getUTCSeconds(),
    //     );
    // }

    // useEffect(() => {
    //     const now = moment().utc();

    // }, []);

    return (
        <div>
            <NavBar />
            {/* <TimerText time={time} /> */}
        </div >
    );
}

export default Timer;
