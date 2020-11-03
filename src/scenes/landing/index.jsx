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

// style
import style from './style/style.module.scss';

function Landing() {
    return <div className={style.landing}>
        <NavBar landing={true} backgroundColor='transparent' />
        <GreenBlock />
        <Header />
        <BlueBlock />
        <GCal />
        <TimeTracking />
        <Data />
    </div >;
}

export default Landing;
