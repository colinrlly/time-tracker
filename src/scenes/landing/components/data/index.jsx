import React from 'react';
import cx from 'classnames';

// Components
import {
    Picker,
    ActivityList as DataActivityList,
    BarChart,
    StackedBarChart,
    TotalsAggregator,
    ActivityListAggregator,
    FilteredTotalsAggregator,
    TotalTimeAggregator,
    StackedTotalsAggregator,
    Tooltip,
    ControlsBtn,
    TotalTime,
} from '../../../data/components';
import {
    H5,
    FakeListFetcher,
} from '../../../../components';

// Styles
import dataStyle from '../../../data/style/structure.module.scss';

function Data() {
    return (
        <div>
            <FakeListFetcher />
            <TotalsAggregator />
            <ActivityListAggregator />
            <StackedTotalsAggregator />
            <FilteredTotalsAggregator />
            <TotalTimeAggregator />

            <nav
                className={
                    cx(
                        dataStyle.controls,
                        false ? dataStyle.closedControls : dataStyle.openControls,
                    )}>
                <H5>Time Range</H5>
                <Picker />
                <DataActivityList />
            </nav>

            <ControlsBtn
                controlsClosed={false}
                handleControlsBtnClick={() => this.handleControlsBtnClick()} />

            <main className={cx(dataStyle.content, false ? dataStyle.fullWidthContent : null)}>
                <div>
                    <Tooltip />
                    <StackedBarChart tweenStatus={0} />
                </div>
            </main>
        </div>
    );
}

export default Data;
