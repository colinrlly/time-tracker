import React, { Component } from 'react';
import cx from 'classnames';

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
import Tooltip from './components/tooltip';
import ControlsBtn from './components/controlsBtn';

import TotalTime from './components/totalTime';
import {
    NavBar,
    H5,
} from '../../components';

import {
    controls,
    content,
    container,
    closedControls,
    fullWidthContent,
    openControls,
} from './style/structure.module.scss';

import './style/fonts.scss';

const TWEEN_LENGTH = 250; // Animate for 250 increments.
const TWEEN_INCREMENT = 2; // Each increment is activated every 2 miliseconds.

const CONTROLS_BREAKPOINT = 900;

/**
 * Data page entry point.
 */
class Data extends Component {
    constructor(props) {
        super(props);

        this.state = {
            controlsClosed: window.innerWidth < CONTROLS_BREAKPOINT,
            tweenStatus: true,
            screenSize: window.innerWidth,
        };

        this.handleResize = this.handleResize.bind(this);
    }

    handleResize() {
        const { screenSize } = this.state;

        // If the window width passes over the controls breakpoint.
        if (
            (screenSize > CONTROLS_BREAKPOINT && window.innerWidth <= CONTROLS_BREAKPOINT)
            || (screenSize <= CONTROLS_BREAKPOINT && window.innerWidth > CONTROLS_BREAKPOINT)
        ) {
            this.setState({
                tweenStatus: 0, // Begin the animation
                screenSize: window.innerWidth,
            });
        } else {
            this.setState({
                screenSize: window.innerWidth,
            });
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }

    static componentWillUnmount() {
        window.addEventListener('resize', this.handleResize);
    }

    handleControlsBtnClick() {
        const { controlsClosed } = this.state;

        this.setState({
            controlsClosed: !controlsClosed,
            tweenStatus: 0, // Begin the animation.
        });
    }

    tweenCharts() {
        setTimeout(() => {
            if (this.state.tweenStatus < TWEEN_LENGTH) {
                this.setState({
                    tweenStatus: this.state.tweenStatus + TWEEN_INCREMENT,
                });
            }
        }, TWEEN_INCREMENT);
    }

    render() {
        const {
            controlsClosed,
            tweenStatus,
        } = this.state;

        this.tweenCharts(); // Will animate the charts while tweenStatus is less than TWEEN_LENGTH.

        return (
            <div className={container}>
                <ListFetcher />
                <TotalsAggregator />
                <ActivityListAggregator />
                <StackedTotalsAggregator />
                <FilteredTotalsAggregator />
                <TotalTimeAggregator />
                <NavBar />

                <nav className={cx(controls, controlsClosed ? closedControls : openControls)}>
                    <H5>DATA SETTINGS</H5>
                    <Picker />
                    <ActivityList />
                    <TotalTime />
                </nav>

                <ControlsBtn
                    controlsClosed={controlsClosed}
                    handleControlsBtnClick={() => this.handleControlsBtnClick()} />

                <main className={cx(content, controlsClosed ? fullWidthContent : null)}>
                    <Tooltip />
                    <BarChart tweenStatus={tweenStatus} />
                    <StackedBarChart tweenStatus={tweenStatus} />
                </main>
            </div>
        );
    }
}

export default Data;
