import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { D3Bar } from './helpers';
import { H6 } from '../../../../components';

import {
    container,
} from './style/style.module.scss';
import './style/chart.css';

const MARGIN = {
    left: 25,
    bottom: 20,
};

class BarChart extends Component {
    constructor(props) {
        super(props);

        this.barChartContainerRef = React.createRef();
    }

    componentDidMount() {
        // Define size parameters.
        this.configuration = {
            margin: MARGIN,
            width: this.barChartContainerRef.current.clientWidth - MARGIN.left - 5,
            height: 300,
        };

        // D3 code to create the chart
        const chart = D3Bar.create(
            this.barChartContainerRef.current,
            this.configuration,
        );

        this.chart = chart;

        // Resize chart on window resize.
        window.addEventListener('resize', () => {
            const newConfiguration = {
                margin: MARGIN,
                width: this.barChartContainerRef.current.clientWidth - MARGIN.left - 5,
                height: 300,
            };

            D3Bar.update(
                this.props.data,
                newConfiguration,
                this.chart,
            );
        });
    }

    componentDidUpdate() {
        // D3 code to update the chart
        const newConfiguration = {
            margin: MARGIN,
            width: this.barChartContainerRef.current.clientWidth - MARGIN.left - 5,
            height: 300,
        };

        D3Bar.update(
            this.props.data,
            newConfiguration,
            this.chart,
        );
    }

    componentWillUnmount() {
        D3Bar.destroy(this.svgNode);
    }

    render() {
        this;

        return (
            <div className={container} ref={this.barChartContainerRef}>
                <H6 marginLeft={MARGIN.left}>Total Hours</H6>
            </div >
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.aggregations.filteredTotals,
});

BarChart.propTypes = {
    data: PropTypes.array.isRequired,
};

export default connect(mapStateToProps, null)(BarChart);
