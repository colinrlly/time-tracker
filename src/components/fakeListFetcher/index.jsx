import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
    setActivityRecords,
} from '../../redux/actions';

import { fakeDataGenerator } from './helpers';

function FakeListFetcher() {
    const startDateTime = useSelector((state) => state.range.startDateTime);
    const endDateTime = useSelector((state) => state.range.endDateTime);
    const numberUpdates = useSelector((state) => state.activityRecords.numberUpdates);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setActivityRecords(fakeDataGenerator(startDateTime, endDateTime)));
    }, [numberUpdates, startDateTime, endDateTime]);

    return (null);
}

export default FakeListFetcher;
