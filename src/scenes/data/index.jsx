import React, { Component } from 'react';
import Picker from './components/picker';
import ListFetcher from './components/listFetcher';
import ActivityListGenerator from './components/activityListGenerator';

/**
 * Data page entry point.
 */
const Data = () => (
    <div>
        <ListFetcher />
        <ActivityListGenerator />
        <Picker />
    </div>
);

export default Data;
