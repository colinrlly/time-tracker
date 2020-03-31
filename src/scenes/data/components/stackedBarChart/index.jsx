import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { D3StackedBar } from './helpers';

import {
    container,
} from './style/styles.module.scss';

import './style/chart.css';

const MARGIN = {
    left: 25,
    bottom: 25,
};

const HEIGHT = 300;

const BAR_SPACING = 2;

class StackedBarChart extends Component {
    constructor(props) {
        super(props);

        this.stackedBarChartContainerRef = React.createRef();
    }

    componentDidMount() {
        // Define size parameters.
        this.configuration = {
            margin: MARGIN,
            width: this.stackedBarChartContainerRef.current.clientWidth - MARGIN.left - 5,
            height: HEIGHT,
        };

        // D3 code to create the chart
        const chart = D3StackedBar.create(
            this.stackedBarChartContainerRef.current,
            this.configuration,
        );

        this.chart = chart;

        // Resize chart on window resize.
        window.addEventListener('resize', () => {
            const newConfiguration = {
                margin: MARGIN,
                width: this.stackedBarChartContainerRef.current.clientWidth - MARGIN.left - 5,
                height: HEIGHT,
                barSpacing: BAR_SPACING,
            };

            D3StackedBar.update(
                this.props.data,
                newConfiguration,
                this.chart,
                this.props.filteredTotals,
                this.props.names,
            );
        });
    }

    componentDidUpdate() {
        // D3 code to update the chart
        const newConfiguration = {
            margin: MARGIN,
            width: this.stackedBarChartContainerRef.current.clientWidth - MARGIN.left - 5,
            height: HEIGHT,
            barSpacing: BAR_SPACING,
        };

        D3StackedBar.update(
            this.props.data,
            newConfiguration,
            this.chart,
            this.props.filteredTotals,
            this.props.names,
        );
    }

    componentWillUnmount() {
        D3StackedBar.destroy(this.svgNode);
    }

    render() {
        this;

        return (
            <div className="tooltipHook">
                <div className={container} ref={this.stackedBarChartContainerRef}></div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.aggregations.stackedTotals,
    filteredTotals: state.aggregations.filteredTotals,
    names: state.names,
});

StackedBarChart.propTypes = {
    data: PropTypes.array.isRequired,
    filteredTotals: PropTypes.array.isRequired,
    names: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, null)(StackedBarChart);
