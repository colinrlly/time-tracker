import * as d3 from 'd3';

const D3Bar = {};

const myData = [
    { duration: 10 },
    { duration: 0 },
    { duration: 3 },
    { duration: 5 },
    { duration: 21 },
    { duration: 15 },
];

D3Bar.create = function create(svgNode, data, configuration) {
    // D3 code to create the bar chart
    const xScale = d3.scaleBand()
        .domain(d3.range(myData.length))
        .range([0, configuration.width]);

    const durations = myData.map((x) => x.duration);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(durations)])
        .range([0, configuration.height]);

    const chart = d3.select(svgNode);

    chart.selectAll('rect')
        .data(durations)
        .enter()
        .append('rect')
        .attr('x', (d, i) => xScale(i))
        .attr('y', (d) => configuration.height - yScale(d))
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => yScale(d))
        .attr('fill', 'steelblue');

    return {
        chart,
        xScale,
        yScale,
    };
};

D3Bar.update = function update(element, newData, configuration, chart, xScale, yScale) {
    const newDurations = newData.map((x) => parseInt(x.duration, 10));

    const barGroups = chart.selectAll('rect')
        .data(newDurations);

    barGroups.enter()
        .append('rect');

    barGroups.transition()
        .duration(300)
        .attr('x', (d, i) => xScale(i))
        .attr('y', (d) => configuration.height - yScale(d))
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => yScale(d));

    barGroups.exit()
        .remove();
};

D3Bar.destroy = function destroy() {
    // Cleaning code
};

export default D3Bar;
