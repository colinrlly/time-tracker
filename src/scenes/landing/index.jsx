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
import {
    GreenBlock,
    BlueBlock,
} from './components/backgroundColors';

function Landing() {
    return <div>
        <NavBar landing={true} backgroundColor='#31B77A' />
        <GreenBlock />
        <Header />
        <BlueBlock />
        <GCal />
        <TimeTracking />
        <Data />
    </div >;
}

export default Landing;
