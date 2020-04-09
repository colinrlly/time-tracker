import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import {
    setAllActivitiesList,
} from '../../../../redux/actions';

function StartupPayloadFetcher() {
    const dispatch = useDispatch();

    useEffect(() => {
        // Fetch the user's "startup payload" from the server.
        axios.post('/api/timer_startup_payload').then((response) => {
            dispatch(setAllActivitiesList(response.data.activities));
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    return (null);
}

export default StartupPayloadFetcher;
