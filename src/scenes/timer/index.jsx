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
} from './components';

function Timer() {
    return (
        <div>
            <StartupPayloadFetcher />
            <NavBar />
            <ActivityNameContainer />
            <TimerTextContainer />
            <DeleteSaveBtns />
            <ActivityListContainer />
        </div >
    );
}

export default Timer;
