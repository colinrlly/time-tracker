import React, { Component } from 'react';
import Picker from './components/picker';
import ListFetcher from './components/listFetcher';
import ActivityListGenerator from './components/activityListGenerator';
import ActivityList from './components/activityList';
import BarChart from './components/barChart';
import Aggregator from './components/aggregator';
import TotalTime from './components/totalTime';
import {
    NavBar,
    H5,
} from '../../components';

import {
    controls,
    content,
    container,
} from './style/structure.module.scss';

/**
 * Data page entry point.
 */
class Data extends Component {
    render() {
        this;

        return (
            <div className={container}>
                <ListFetcher />
                <ActivityListGenerator />
                <Aggregator />
                <NavBar />

                <nav className={controls}>
                    <H5>DATA SETTINGS</H5>
                    <Picker />
                    <ActivityList />
                    <TotalTime />
                </nav>

                <main className={content}>
                    <BarChart />
                </main>
            </div>
        );
    }
}

export default Data;
