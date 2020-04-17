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
            <FullScreenClickHandler />
            <ActivityDialogContainer />
            <FullScreenBlur>
                <NavBar />
                <NewActivityBtnContainer />
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
