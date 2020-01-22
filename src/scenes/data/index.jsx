import React, { Component } from 'react';
import Picker from './components/picker';
import ListFetcher from './components/listFetcher';

/**
 * Data page entry point.
 */
const Data = () => (
    <div>
        <ListFetcher />
        <Picker />
    </div>
);

export default Data;
