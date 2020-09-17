import React from 'react';

import {
    NavBar,
} from '../../components';
import {
    Header,
    GCal,
    TimeTracking,
    Data,
} from './components';

function Landing() {
    return <div>
        <NavBar landing={true} backgroundColor='#31B77A' />
        <Header />
        <GCal />
        <TimeTracking />
        <Data />
    </div >;
}

export default Landing;
