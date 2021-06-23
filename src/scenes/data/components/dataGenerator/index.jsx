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
    const dispatch = useDispatch();

    useEffect(() => {
        fetchEventsList(
            range.startDateTime,
            range.endDateTime,
        ).then((eventsList) => {
            const totals = generateTotals(eventsList);
            const activityNames = generateActivityNames(totals);
            const stackedTotals = generateStackedTotals(
                eventsList,
                range.startDateTime,
                range.endDateTime,
                activityNames,
                getIntervalFromRange(range),
                1,
            );
            const filteredTotals = generateFilteredTotals(totals, activityNames);
            const totalTime = generateTotalTime(filteredTotals);

            batch(() => {
                dispatch(setActivityRecords(eventsList));
                dispatch(setAggTotals(totals));
                dispatch(setActivityNames(activityNames));
                dispatch(setAggStackedTotals(stackedTotals));
                dispatch(setAggFilteredTotals(filteredTotals));
                dispatch(setAggTotalTime(totalTime));
            });
        });
    }, [numberUpdates, range]);

    return (null);
}

export default DataGenerator;
