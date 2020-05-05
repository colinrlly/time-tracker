import React from 'react';
import { useDispatch } from 'react-redux';
import io from 'socket.io-client';
import moment from 'moment';

import {
    setActivityIsRunning,
    setHasUnsavedActivityRecord,
    setLastActivityStopTime,
} from '../../redux/actions';

const ENDPOINT = '/';
const socket = io.connect(ENDPOINT);

function Socket() {
    const dispatch = useDispatch();

    socket.on('update', (message) => {
        switch (message.type) {
            case 'stopped_activity':
                dispatch(setActivityIsRunning(false));
                dispatch(setHasUnsavedActivityRecord(true));
                dispatch(setLastActivityStopTime(moment(message.stop_time)));
                break;

            default:
                break;
        }
    });

    return (null);
}

export default Socket;
