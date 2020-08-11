import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { D3StackedBar } from './helpers';
import { H6 } from '../../../../components';

import {
    container,
} from './style/style.module.scss';
import {
    getIntervalFromRange,
} from '../../helpers';

import './style/chart.css';

const MARGIN = {
    left: 40,
    bottom: 30,
};

const HEIGHT = 300;

const BAR_VERTICLE_SPACING = 2;
const BAR_GUTTER = 0.4;
const PADDING_OUTER = 0.5;

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

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
                barVerticleSpacing: BAR_VERTICLE_SPACING,
                barGutter: BAR_GUTTER,
                paddingOuter: PADDING_OUTER,
            };

            D3StackedBar.update(
                this.props.data,
                newConfiguration,
                this.chart,
                this.props.filteredTotals,
                this.props.names,
                this.props.range,
            );
        });
    }

    componentDidUpdate() {
        // D3 code to update the chart
        const newConfiguration = {
            margin: MARGIN,
            width: this.stackedBarChartContainerRef.current.clientWidth - MARGIN.left - 5,
            height: HEIGHT,
            barVerticleSpacing: BAR_VERTICLE_SPACING,
            barGutter: BAR_GUTTER,
            paddingOuter: PADDING_OUTER,
        };

        D3StackedBar.update(
            this.props.data,
            newConfiguration,
            this.chart,
            this.props.filteredTotals,
            this.props.names,
            this.props.range,
        );
    }

    componentWillUnmount() {
        D3StackedBar.destroy(this.svgNode);
    }

    render() {
        const interval = capitalizeFirstLetter(getIntervalFromRange(this.props.range));

        return (
            <div className={container} ref={this.stackedBarChartContainerRef}>
                <H6 marginLeft={MARGIN.left}>
                    {`Total Hours Per ${interval}`}
                </H6>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.aggregations.stackedTotals,
    filteredTotals: state.aggregations.filteredTotals,
    names: state.names,
    range: state.range,
});

StackedBarChart.propTypes = {
    data: PropTypes.array.isRequired,
    filteredTotals: PropTypes.array.isRequired,
    names: PropTypes.object.isRequired,
    range: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, null)(StackedBarChart);
