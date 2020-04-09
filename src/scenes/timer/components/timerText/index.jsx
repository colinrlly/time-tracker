import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const ONE_DAY = moment.duration(1, 'day');

function TimerText(props) {
    const [displayedTime, setDisplayedTime] = useState(null);
    const [timerIntervalId, setTimerIntervalId] = useState(null);

    function displayTime(duration) {
        setDisplayedTime(
            moment.utc(duration.asMilliseconds())
                .format(`${duration > ONE_DAY ? 'DD' : ''} HH:mm:ss`));
    }

    useEffect(() => {
        if (props.runningActivity) {
            clearInterval(timerIntervalId);

            const diff = moment.utc() - props.lastActivityStartTime;
            const duration = moment.duration(diff, 'milliseconds');

            displayTime(duration);
            setTimerIntervalId(setInterval(() => {
                duration.add(1, 'second');
                displayTime(duration);
            }, 1000));
        } else {
            setDisplayedTime('00:00:00');
        }
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
