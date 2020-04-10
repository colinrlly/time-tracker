import React from 'react';

import {
    NavBar,
} from '../../components';

import {
    TimerTextContainer,
    ActivityListContainer,
    StartupPayloadFetcher,
} from './components';

function Timer() {
    return (
        <div>
            <StartupPayloadFetcher />
            <NavBar />
            <TimerTextContainer />
            <ActivityListContainer />
        </div >
    );
}

export default Timer;
