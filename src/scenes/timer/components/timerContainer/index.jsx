import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import {
    TimerTextContainer,
    ActivityNameContainer,
    DeleteSaveBtns,
    StopBtnContainer,
    NewActivityBtnContainer,
} from './components';

import style from './style/style.module.scss';

function TimerContainer() {
    const activityIsRunning = useSelector((state) => state.activityIsRunning);
    const hasUnsavedActivityRecord = useSelector((state) => state.hasUnsavedActivityRecord);

    const timerContainerStyle = cx(
        style.timerContainer,
        (activityIsRunning || hasUnsavedActivityRecord)
            ? style.activityIsRunning
            : null,
    );

    return (
        <div className={timerContainerStyle}>
            <ActivityNameContainer />
            <NewActivityBtnContainer />
            <TimerTextContainer />
            <StopBtnContainer />
            <DeleteSaveBtns />
        </div>
    );
}

export default TimerContainer;
