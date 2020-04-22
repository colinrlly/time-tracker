import React from 'react';

import {
    NavBar,
} from '../../components';

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
    return (
        <div>
            <StartupPayloadFetcher />
            <FullScreenClickHandler />
            <ActivityDialogContainer />
            <FullScreenBlur>
                <NavBar />
                <ActivityNameContainer />
                <div className={style.timerContainer}>
                    <NewActivityBtnContainer />
                    <TimerTextContainer />
                </div>
                <StopBtnContainer />
                <DeleteSaveBtns />
                <ActivityListContainer />
            </FullScreenBlur>
        </div >
    );
}

export default Timer;
