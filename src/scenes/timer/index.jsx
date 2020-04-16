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
} from './components';

function Timer() {
    return (
        <div>
            <StartupPayloadFetcher />
            <NavBar />
            <ActivityNameContainer />
            <TimerTextContainer />
            <StopBtnContainer />
            <DeleteSaveBtns />
            <ActivityListContainer />
        </div >
    );
}

export default Timer;
