import React, { Component } from 'react';
import { connect } from 'react-redux';
import { D3Bar } from './helpers';

class BarChart extends Component {
    componentDidMount() {
        // D3 cod eto create the chart
        this.chart = D3Bar.create(
            this.refs.svgNode,
            this.props.data,
            this.props.config,
        );
    }

    componentDidUpdate() {
        // D3 code to update the chart
        D3Bar.update(
            this.svgNode,
            this.props.data,
            this.props.config,
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
    list: state.list,
});

export default connect(mapStateToProps, null)(BarChart);
