import React from 'react';

import {
    NavBar,
} from '../../components';

import {
    TimerTextContainer,
    ActivityListContainer,
    StartupPayloadFetcher,
    ActivityNameContainer,
} from './components';

function Timer() {
    return (
        <div>
            <StartupPayloadFetcher />
            <NavBar />
            <ActivityNameContainer />
            <TimerTextContainer />
            <ActivityListContainer />
        </div >
    );
}

export default Timer;
