import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const ONE_DAY = moment.duration(1, 'day');

function TimerText(props) {
    const [displayedTime, setDisplayedTime] = useState(null);

    function displayTime(duration) {
        const seconds = (`0${duration.seconds()}`).substr(-2, 2);
        const minutes = (`0${duration.minutes()}`).substr(-2, 2);
        const hours = (`0${duration.hours()}`).substr(-2, 2);
        const days = (`0${duration.days()}`).substr(-2, 2);

        setDisplayedTime(`${duration > ONE_DAY ? `${days}:` : ''}${hours}:${minutes}:${seconds}`);
    }

    useEffect(() => {
        let intervalId = null;

        if (props.runningActivity) {
            const diff = moment.utc() - props.lastActivityStartTime;
            const duration = moment.duration(diff, 'milliseconds');

            displayTime(duration);
            intervalId = setInterval(() => {
                duration.add(1, 'second');
                displayTime(duration);
            }, 1000);
        } else {
            setDisplayedTime('00:00:00');
        }

        return (() => clearInterval(intervalId));
    }, [props.lastActivityStartTime, props.runningActivity]);

    return (
        <span>{displayedTime}</span>
    );
}

TimerText.propTypes = {
    lastActivityStartTime: PropTypes.instanceOf(moment).isRequired,
    runningActivity: PropTypes.bool.isRequired,
};

export default TimerText;
