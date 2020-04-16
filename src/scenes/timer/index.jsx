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
} from './components';

function Timer() {
    return (
        <div>
            <StartupPayloadFetcher />
            <NavBar />
            <NewActivityBtnContainer />
            <ActivityDialogContainer />
            <ActivityNameContainer />
            <TimerTextContainer />
            <StopBtnContainer />
            <DeleteSaveBtns />
            <ActivityListContainer />
        </div >
    );
}

export default Timer;
