import React, { useState, useEffect } from 'react';
import cx from 'classnames';

import {
    Picker,
    ListFetcher,
    ActivityList,
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
    DataGenerator
} from './components';

import {
    NavBar,
    H5,
    Footer,
    withPremiumRBAC,
} from '../../components';

import {
    controls,
    content,
    container,
    closedControls,
    fullWidthContent,
    openControls,
    footerPusher,
} from './style/structure.module.scss';

import './style/fonts.scss';

const TWEEN_LENGTH = 250; // Animate for 250 increments.
const TWEEN_INCREMENT = 2; // Each increment is activated every 2 miliseconds.

const CONTROLS_BREAKPOINT = 900;

function Data() {
    const [controlsClosed, setControlsClosed] = useState(window.innerWidth < CONTROLS_BREAKPOINT);
    const [tweenStatus, setTweenStatus] = useState(true);
    const [screenSize, setScreenSize] = useState(window.innerWidth);

    function handleResize() {
        // If the window width passes over the controls breakpoint.
        if (
            (screenSize > CONTROLS_BREAKPOINT && window.innerWidth <= CONTROLS_BREAKPOINT)
            || (screenSize <= CONTROLS_BREAKPOINT && window.innerWidth > CONTROLS_BREAKPOINT)
        ) {
            setTweenStatus(0);
            setScreenSize(window.innerWidth);
        } else {
            setScreenSize(window.innerWidth);
        }
    }

    function handleControlsBtnClick() {
        setControlsClosed(!controlsClosed);
        setTweenStatus(0); // Begin the animation.
    }

    useEffect(() => {
        setTimeout(() => {
            if (tweenStatus < TWEEN_LENGTH) {
                setTweenStatus(tweenStatus + TWEEN_INCREMENT);
            }
        }, TWEEN_INCREMENT);
    }, [tweenStatus]);

    const StackedBarChartWithRBAC = withPremiumRBAC(
        <StackedBarChart tweenStatus={tweenStatus} />,
    );

    useEffect(() => {
        window.addEventListener('resize', handleResize);
    }, []);

    return (
        <div className={container}>
            <DataGenerator />
            {/* <ListFetcher />
            <TotalsAggregator />
            <ActivityListAggregator />
            <StackedTotalsAggregator />
            <FilteredTotalsAggregator />
            <TotalTimeAggregator /> */}
            <NavBar shadow={true} />

            <nav className={cx(controls, controlsClosed ? closedControls : openControls)}>
                <H5>Time Range</H5>
                <Picker />
                <ActivityList />
                <TotalTime />
            </nav>

            <ControlsBtn
                controlsClosed={controlsClosed}
                handleControlsBtnClick={() => handleControlsBtnClick()} />

            <main className={cx(content, controlsClosed ? fullWidthContent : null)}>
                <div className={footerPusher}>
                    <Tooltip />
                    <BarChart tweenStatus={tweenStatus} />
                    {StackedBarChartWithRBAC}
                </div>
                <Footer />
            </main>
        </div>
    );
}

export default Data;
