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
        axios.post('api/stop-activity').then((response) => {
            if (response.data.code !== 'success') {
                console.error('Problem stopping activity');
            }
        }).catch(() => {
            console.error('Error stopping activity');
        });
    }

    return activityIsRunning
        ? <Btn callback={callback} text={'Stop'} className={btnStyle.btn} />
        : null;
}

export default StopBtnContainer;
