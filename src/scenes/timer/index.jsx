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

function Timer() {
    return (
        <div>
            <StartupPayloadFetcher />
            <NavBar />
            <FullScreenClickHandler />
            <FullScreenBlur>
                <NewActivityBtnContainer />
                <ActivityDialogContainer />
                <ActivityNameContainer />
                <TimerTextContainer />
                <StopBtnContainer />
                <DeleteSaveBtns />
                <ActivityListContainer />
            </FullScreenBlur>
        </div >
    );
}

export default Timer;
