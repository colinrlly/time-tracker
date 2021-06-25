import React, { useEffect } from 'react';
import { useSelector, useDispatch, batch } from 'react-redux';

import {
    setActivityRecords,
    setAggTotals,
    setActivityNames,
    setAggStackedTotals,
    setAggFilteredTotals,
    setAggTotalTime,
} from '../../../../redux/actions';

import {
    getIntervalFromRange,
} from '../../helpers';

import {
    generateTotals,
    generateActivityNames,
    generateStackedTotals,
    generateFilteredTotals,
    generateTotalTime,
} from './helpers/aggregators';

import {
    fetchEventsList,
} from './helpers';

function DataGenerator() {
    const range = useSelector((state) => state.range);
    const numberUpdates = useSelector((state) => state.activityRecords.numberUpdates);
    const reduxActivityNames = useSelector((state) => state.names);
    const reduxEventsList = useSelector((state) => state.activityRecords.list);
    const reduxTotals = useSelector((state) => state.aggregations.totals);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchEventsList(
            range.startDateTime,
            range.endDateTime,
        ).then((eventsList) => {
            const totals = generateTotals(eventsList);
            const activityNames = generateActivityNames(totals);
            const filteredTotals = generateFilteredTotals(totals, activityNames);

            batch(() => {
                dispatch(setActivityRecords(eventsList));
                dispatch(setAggTotals(totals));
                dispatch(setActivityNames(activityNames));
                dispatch(setAggFilteredTotals(filteredTotals));
            });
        });
    }, [numberUpdates, range]);

    useEffect(() => {
        const stackedTotals = generateStackedTotals(
            reduxEventsList,
            range.startDateTime,
            range.endDateTime,
            reduxActivityNames,
            getIntervalFromRange(range),
            1,
        );
        const filteredTotals = generateFilteredTotals(reduxTotals, reduxActivityNames);
        const totalTime = generateTotalTime(filteredTotals);

        batch(() => {
            dispatch(setAggStackedTotals(stackedTotals));
            dispatch(setAggFilteredTotals(filteredTotals));
            dispatch(setAggTotalTime(totalTime));
        });
    }, [reduxEventsList, reduxActivityNames, reduxTotals]);

    return (null);
}

export default DataGenerator;
