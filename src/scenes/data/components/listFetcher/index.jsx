import React, { useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

import {
    setActivityRecords,
} from '../../../../redux/actions';
import {
    timeRangeFilter,
} from './helpers';

function ListFetcher() {
    const startDateTime = useSelector((state) => state.range.startDateTime);
    const endDateTime = useSelector((state) => state.range.endDateTime);
    const numberUpdates = useSelector((state) => state.activityRecords.numberUpdates);
    const dispatch = useDispatch();

    useEffect(() => {
        // Fetch the user's list of activity records from the server.
        axios.post('/api/list_events', {
            startDateTime: startDateTime.format(),
            endDateTime: endDateTime.format(),
        }).then((response) => {
            const filteredByTime = timeRangeFilter(
                startDateTime,
                endDateTime,
                response.data.list,
            );
            const filteredByTimeAndAllDay = filteredByTime.filter((x) => !x.start.date);

            dispatch(setActivityRecords(filteredByTimeAndAllDay));
        }).catch((error) => {
            console.log(error);
        });
    }, [numberUpdates, startDateTime, endDateTime]);

    return (null);
}

export default ListFetcher;
