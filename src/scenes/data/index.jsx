import React, { Component } from 'react';
import Picker from './components/picker';
import ListFetcher from './components/listFetcher';
import ActivityList from './components/activityList';
import BarChart from './components/barChart';
import StackedBarChart from './components/stackedBarChart';
import TotalsAggregator from './components/aggregators/totalsAggregator';
import ActivityListAggregator from './components/aggregators/activityListAggregator';
import FilteredTotalsAggregator from './components/aggregators/filteredTotalsAggregator';
import TotalTimeAggregator from './components/aggregators/totalTimeAggregator';
import StackedTotalsAggregator from './components/aggregators/StackedTotalsAggregator';

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

import './style/fonts.scss';

/**
 * Data page entry point.
 */
class Data extends Component {
    render() {
        this;

        return (
            <div className={container}>
                <ListFetcher />
                <TotalsAggregator />
                <ActivityListAggregator />
                <StackedTotalsAggregator />
                <FilteredTotalsAggregator />
                <TotalTimeAggregator />
                <NavBar />

                <nav className={controls}>
                    <H5>DATA SETTINGS</H5>
                    <Picker />
                    <ActivityList />
                    <TotalTime />
                </nav>

                <main className={content}>
                    <BarChart />
                    {/* <StackedBarChart /> */}
                </main>
            </div>
        );
    }
}

export default Data;
