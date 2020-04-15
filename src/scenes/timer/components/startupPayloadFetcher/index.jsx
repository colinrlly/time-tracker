import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import {
    setAllActivitiesList,
    setCurrentActivity,
    setActivityIsRunning,
    setLastActivityStartTime,
    setHasUnsavedActivityRecord,
} from '../../../../redux/actions';

function StartupPayloadFetcher() {
    const dispatch = useDispatch();

    useEffect(() => {
        // Fetch the user's "startup payload" from the server.
        axios.post('/api/timer_startup_payload').then((response) => {
            dispatch(setAllActivitiesList(response.data.activities));
            dispatch(setCurrentActivity(response.data.current_activity));
            dispatch(setActivityIsRunning(response.data.running_activity));
            dispatch(setLastActivityStartTime(moment(response.data.start_time)));
            dispatch(setHasUnsavedActivityRecord(response.data.has_unsaved_activity_record));
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    return (null);
}

export default StartupPayloadFetcher;
