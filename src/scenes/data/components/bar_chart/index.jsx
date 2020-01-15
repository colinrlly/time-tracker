import React, { Component } from 'react';

export default class Bar_Chart extends Component {
    componentDidMount() {
        this.setState({
            data: [5, 10, 20, 100],
        })

        this.chart = React.createRef();
        this.draw();
    }

    draw() {
        var svg = this.chart
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight);

        var barChart = svg.selectAll("rect")
            .data(this.data)
            .enter()
            .append("rect")
            .attr("y", (d) => {
                return this.svgHeight - d;
            })
            .attr("height", (d) => {
                return d;
            })
            .attr("width", this.barWidth - this.barPadding)
            .attr("transform", (d, i) => {
                var translate = [this.barWidth * i, 0];
                return "translate(" + translate + ")";
            });
    }

    render() {
        return (
            <svg class="bar_chart" ref={this.chart}></svg>
        )
    }
}
