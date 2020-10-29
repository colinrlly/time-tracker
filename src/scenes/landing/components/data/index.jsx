import React, { useState } from 'react';
import cx from 'classnames';

// Components
import {
    Picker,
    ActivityList as DataActivityList,
    StackedBarChart,
    TotalsAggregator,
    ActivityListAggregator,
    FilteredTotalsAggregator,
    TotalTimeAggregator,
    StackedTotalsAggregator,
    Tooltip,
    ControlsBtn,
} from '../../../data/components';
import {
    H5,
    FakeListFetcher,
} from '../../../../components';

// Styles
import style from './style/style.module.scss';

function Data() {
    const [controlsClosed, setControlsClosed] = useState(true);

    function handleControlsBtnClick() {
        setControlsClosed(!controlsClosed);
    }

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
                        style.controls,
                        controlsClosed ? style.closedControls : style.openControls,
                    )}>
                <H5>Time Range</H5>
                <Picker />
                <DataActivityList />
            </nav>

            <ControlsBtn
                controlsClosed={controlsClosed}
                handleControlsBtnClick={() => handleControlsBtnClick()} />

            <main className={
                cx(style.content, controlsClosed ? style.fullWidthContent : null)}>
                <div>
                    <Tooltip />
                    <StackedBarChart />
                </div>
            </main>
        </div>
    );
}

export default Data;
