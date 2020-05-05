import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import {
    Btn,
} from '../../../../../components';

import btnStyle from '../style/style.module.scss';

function StopBtnContainer() {
    const activityIsRunning = useSelector((state) => state.activityIsRunning);

    function callback() {
        axios.post('api/stop-activity');
    }

    return activityIsRunning
        ? <Btn callback={callback} text={'Stop'} className={btnStyle.btn} />
        : null;
}

export default StopBtnContainer;
