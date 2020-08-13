import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import cx from 'classnames';

import {
    utcNow,
} from '../../../../../../../../helpers';

import style from './style/style.module.scss';

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
            let now = utcNow();
            let diff = now - props.lastActivityStartTime;
            let duration = moment.duration(diff, 'milliseconds');

            displayTime(duration);
            intervalId = setInterval(() => {
                now = utcNow();
                diff = now - props.lastActivityStartTime;
                duration = moment.duration(diff, 'milliseconds');
                displayTime(duration);
            }, 1000);
        } else if (props.hasUnsavedActivityRecord) {
            const diff = props.lastActivityStopTime - props.lastActivityStartTime;
            const duration = moment.duration(diff, 'milliseconds');

            displayTime(duration);
        } else {
            setDisplayedTime('00:00:00');
        }

        return (() => clearInterval(intervalId));
    }, [
        props.lastActivityStartTime,
        props.runningActivity,
        props.hasUnsavedActivityRecord,
        props.lastActivityStopTime,
    ]);

    return (
        <span className={cx(
            style.timerText,
            props.runningActivity ? style.runningActivity : null,
        )}>{displayedTime}</span>
    );
}

TimerText.propTypes = {
    lastActivityStartTime: PropTypes.instanceOf(moment),
    lastActivityStopTime: PropTypes.instanceOf(moment),
    runningActivity: PropTypes.bool.isRequired,
    hasUnsavedActivityRecord: PropTypes.bool.isRequired,
};

export default TimerText;
