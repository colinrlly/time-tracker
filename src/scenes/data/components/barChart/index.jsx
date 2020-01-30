import React, { Component } from 'react';
import { connect } from 'react-redux';
import { D3Bar } from './helpers';

class BarChart extends Component {
    componentDidMount() {
        // Define size parameters.
        const margin = 80;

        this.configuration = {
            margin,
            width: 1000 - 2 * margin,
            height: 600 - 2 * margin,
        };

        // D3 code to create the chart
        const { chart, xScale, yScale } = D3Bar.create(
            this.refs.svgNode,
            this.props.data,
            this.configuration,
        );

        this.chart = chart;
        this.xScale = xScale;
        this.yScale = yScale;
    }

    componentDidUpdate() {
        // D3 code to update the chart
        D3Bar.update(
            this.refs.svgNode,
            this.props.data,
            this.configuration,
            this.chart,
            this.xScale,
            this.yScale,
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

        const containerStyles = { width: 1000, height: 600 };
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
