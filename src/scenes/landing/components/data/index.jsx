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
import landingStyle from '../../style/style.module.scss';

// Images
import AnalyticsIcon from '../../images/analytics_icon.png';

function Data() {
    const [controlsClosed, setControlsClosed] = useState(true);

    function handleControlsBtnClick() {
        setControlsClosed(!controlsClosed);
    }

    return (
        <div className={style.data}>
            <FakeListFetcher />
            <TotalsAggregator />
            <ActivityListAggregator />
            <StackedTotalsAggregator />
            <FilteredTotalsAggregator />
            <TotalTimeAggregator />

            <img className={landingStyle.sectionIcon} src={AnalyticsIcon} />

            <h1 className={landingStyle.sectionIcon}>Illuminating Data Analytics</h1>

            <h2 className={landingStyle.sectionH2}>Unlock your productivity by clearly
            seeing how you spend your time. Turnip gives you complete power to see
            where you spend your time. See your habits through clear visuals and
            precise controls.</h2>

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
