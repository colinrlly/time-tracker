import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import {
    NavBar,
} from '../../components';

import googleColors from '../../static/js/google_colors';

import {
    TimerTextContainer,
    ActivityListContainer,
    StartupPayloadFetcher,
    ActivityNameContainer,
    DeleteSaveBtns,
    StopBtnContainer,
    ActivityDialogContainer,
    NewActivityBtnContainer,
    FullScreenClickHandler,
    FullScreenBlur,
} from './components';

import style from './style/style.module.scss';

function Timer() {
    const activityIsRunning = useSelector((state) => state.activityIsRunning);
    const hasUnsavedActivityRecord = useSelector((state) => state.hasUnsavedActivityRecord);
    const currentActivity = useSelector((state) => state.currentActivity);

    return (
        <div style={{
            backgroundColor: (activityIsRunning)
                ? googleColors[currentActivity.color]
                : null,
        }}>
            <StartupPayloadFetcher />
            <FullScreenClickHandler />
            <ActivityDialogContainer />
            <FullScreenBlur>
                <NavBar
                    shadow={false}
                    backgroundColor={
                        activityIsRunning ? googleColors[currentActivity.color] : null
                    } />
                <div className={
                    (activityIsRunning || hasUnsavedActivityRecord)
                        ? style.verticalCenterShown
                        : null
                }>
                    <div className={
                        cx(
                            style.timerContainer,
                            (activityIsRunning || hasUnsavedActivityRecord)
                                ? style.activityIsRunning
                                : null,
                        )
                    }>
                        <ActivityNameContainer />
                        <NewActivityBtnContainer />
                        <TimerTextContainer />
                        <StopBtnContainer />
                        <DeleteSaveBtns />
                    </div>
                </div>
                <ActivityListContainer />
            </FullScreenBlur>
        </div >
    );
}

export default Timer;
