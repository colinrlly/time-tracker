import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import {
    setActivityIsRunning,
    setHasUnsavedActivityRecord,
} from '../../../../redux/actions';

import {
    Btn,
} from '../../../../components';

function StopBtnContainer() {
    const activityIsRunning = useSelector((state) => state.activityIsRunning);
    const dispatch = useDispatch();

    function callback() {
        axios.post('api/stop-activity').then((response) => {
            if (response.data.code === 'success') {
                dispatch(setActivityIsRunning(false));
                dispatch(setHasUnsavedActivityRecord(true));
            } else {
                console.error('problem stopping activity');
            }
        });
    }

    return activityIsRunning ? <Btn callback={callback} text={'Stop'} /> : null;
}

export default StopBtnContainer;
