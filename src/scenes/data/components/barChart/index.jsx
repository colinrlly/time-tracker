import React, { Component } from 'react';
import { connect } from 'react-redux';
import { D3Bar } from './helpers';

class BarChart extends Component {
    componentDidMount() {
        // Define size parameters.
        const margin = {
            left: 30,
            bottom: 20,
        };

        this.configuration = {
            margin,
            width: 500,
            height: 300,
        };

        // D3 code to create the chart
        const chart = D3Bar.create(
            this.configuration,
        );

        this.chart = chart;
    }

    componentDidUpdate() {
        // D3 code to update the chart
        D3Bar.update(
            this.props.data.map((x) => ({
                name: x.name.substring(0, 6),
                duration: x.duration,
            })),
            this.configuration,
            this.chart,
        );
    }

    componentWillUnmount() {
        D3Bar.destroy(this.svgNode);
    }

    render() {
        this;

        const containerStyles = {
            padding: 0,
            border: '1px solid red',
        };

        return (
            <div className="container" style={containerStyles}></div>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.aggregations.totals,
});

export default connect(mapStateToProps, null)(BarChart);
