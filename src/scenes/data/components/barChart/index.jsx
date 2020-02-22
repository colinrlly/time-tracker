import React, { Component } from 'react';
import { connect } from 'react-redux';
import { D3Bar } from './helpers';

class BarChart extends Component {
    componentDidMount() {
        // Define size parameters.
        const margin = 80;

        this.configuration = {
            margin,
            width: 500,
            height: 300,
        };

        // D3 code to create the chart
        const chart = D3Bar.create(
            this.refs.svgNode,
            this.configuration,
        );

        this.chart = chart;
    }

    componentDidUpdate() {
        // D3 code to update the chart
        D3Bar.update(
            this.props.data,
            this.configuration,
            this.chart,
        );
    }

    componentWillUnmount() {
        D3Bar.destroy(this.svgNode);
    }

    setSVGRef(svgNode) {
        this.svgNode = svgNode;
    }

    render() {
        this;

        const containerStyles = { width: 500, height: 300, padding: 0 };
        const svgStyles = { width: '100%', height: '100%' };

        return (
            <div className="container" style={containerStyles}>
                <svg className="bar-container" style={svgStyles} ref='svgNode' />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.aggregations.totals,
});

export default connect(mapStateToProps, null)(BarChart);
