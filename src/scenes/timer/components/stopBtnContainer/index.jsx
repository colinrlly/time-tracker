import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import moment from 'moment';

import {
    setActivityIsRunning,
    setHasUnsavedActivityRecord,
    setLastActivityStopTime,
} from '../../../../redux/actions';

import {
    Btn,
} from '../../../../components';

import style from './style/style.module.scss';

function StopBtnContainer() {
    const activityIsRunning = useSelector((state) => state.activityIsRunning);
    const dispatch = useDispatch();

    function callback() {
        axios.post('api/stop-activity').then((response) => {
            if (response.data.code === 'success') {
                dispatch(setActivityIsRunning(false));
                dispatch(setHasUnsavedActivityRecord(true));
                dispatch(setLastActivityStopTime(moment(response.data.stop_time)));
            } else {
                console.error('problem stopping activity');
            }
        });
    }

    return activityIsRunning
        ? <Btn callback={callback} text={'Stop'} className={style.stopBtn} />
        : null;
}

export default StopBtnContainer;
