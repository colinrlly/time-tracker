import React, { Component } from 'react';
import Picker from './components/picker';
import ListFetcher from './components/listFetcher';
import ActivityListGenerator from './components/activityListGenerator';
import ActivityList from './components/activityList';

/**
 * Data page entry point.
 */
const Data = () => (
    <div>
        <ListFetcher />
        <ActivityListGenerator />
        <Picker />
        <ActivityList />
    </div>
);

export default Data;
