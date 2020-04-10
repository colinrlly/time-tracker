import React from 'react';
import { useSelector } from 'react-redux';

import { ActivityList } from './components';

function ActivityListContainer() {
    const allActivitiesList = useSelector((state) => state.allActivitiesList);

    return (
        <ActivityList activities={allActivitiesList} />
    );
}

export default ActivityListContainer;
