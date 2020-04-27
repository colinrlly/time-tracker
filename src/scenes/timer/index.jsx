import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import {
    NavBar,
    Footer,
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

    const backgroundColor = {
        backgroundColor: (activityIsRunning)
            ? googleColors[currentActivity.color]
            : null,
    };
    const navBarBackgroundColor = activityIsRunning ? googleColors[currentActivity.color] : null;
    const verticleContainerShown = (activityIsRunning || hasUnsavedActivityRecord)
        ? style.verticalCenterShown
        : null;
    const timerContainerStyle = cx(
        style.timerContainer,
        (activityIsRunning || hasUnsavedActivityRecord)
            ? style.activityIsRunning
            : null,
    );

    return (
        <div style={backgroundColor} className={style.backgroundColor}>
            <StartupPayloadFetcher />
            <FullScreenClickHandler />
            <ActivityDialogContainer />
            <FullScreenBlur>
                <NavBar shadow={false} backgroundColor={navBarBackgroundColor} />
                <div className={style.content}>
                    <div className={verticleContainerShown}>
                        <div className={timerContainerStyle}>
                            <ActivityNameContainer />
                            <NewActivityBtnContainer />
                            <TimerTextContainer />
                            <StopBtnContainer />
                            <DeleteSaveBtns />
                        </div>
                    </div>
                    <ActivityListContainer />
                </div>
                <Footer color={activityIsRunning ? '#FFFFFF' : null} />
            </FullScreenBlur>
        </div >
    );
}

export default Timer;
