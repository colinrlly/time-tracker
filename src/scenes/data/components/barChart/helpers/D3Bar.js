import * as d3 from 'd3';

const D3Bar = {};

const myData = [
    { name: 'games', duration: 200.03 },
    { name: 'mag', duration: 50.05 },
    { name: 'roger', duration: 123.98 },
    { name: 'rogers', duration: 23.98 },
    { name: 'rog', duration: 153.98 },
];

D3Bar.create = function create(configuration) {
    const chart = d3.select('.container')
        .append('svg')
        .attr('width', configuration.width)
        .attr('height', configuration.height);

    const axisMarginBottom = 20;
    const axisMarginLeft = 30;

    const xScale = d3.scaleBand()
        .domain(myData.map((d) => d.name))
        .range([0, configuration.width - axisMarginLeft])
        .padding(0.4);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(myData.map((d) => d.duration))])
        .range([configuration.height - axisMarginBottom * 2, 0]);

    chart.selectAll('rect')
        .data(myData, (d) => d.name)
        .enter()
        .append('rect')
        .attr('x', (d) => xScale(d.name) + axisMarginLeft)
        .attr('y', (d) => yScale(d.duration) + axisMarginBottom)
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => configuration.height - yScale(d.duration) - axisMarginBottom * 2);

    // Add scales to axis
    const xAxis = d3.axisBottom()
        .scale(xScale);

    // Append group and insert axis
    const xAxisTranslate = configuration.height - axisMarginBottom;

    chart.append('g')
        .attr('id', 'xAxis')
        .attr('transform', `translate(${axisMarginLeft}, ${xAxisTranslate})`)
        .call(xAxis);

    const yAxis = d3.axisLeft()
        .scale(yScale);

    chart.append('g')
        .attr('id', 'yAxis')
        .attr('transform', `translate(${axisMarginLeft}, ${axisMarginBottom})`)
        .call(yAxis);

    return chart;
};

D3Bar.update = function update(newData, configuration, chart) {
    const axisMarginBottom = 20;
    const axisMarginLeft = 30;

    const newXScale = d3.scaleBand()
        .domain(newData.map((d) => d.name))
        .range([0, configuration.width - axisMarginLeft])
        .padding(0.4);

    const newYScale = d3.scaleLinear()
        .domain([0, d3.max(newData.map((d) => d.duration))])
        .range([configuration.height - axisMarginBottom * 2, 0])
        .nice();

    const oldRects = chart.selectAll('rect')
        .data(newData, (d) => d.name);

    oldRects.enter()
        .append('rect')
        .merge(oldRects)
        .attr('x', (d) => newXScale(d.name) + axisMarginLeft)
        .attr('y', (d) => newYScale(d.duration) + axisMarginBottom)
        .attr('width', newXScale.bandwidth())
        .attr('height', (d) => configuration.height - newYScale(d.duration) - axisMarginBottom * 2);

    oldRects.exit().remove();

    // Add scales to axis
    const oldXAxis = chart.select('#xAxis');
    const oldYAxis = chart.select('#yAxis');

    const newXAxis = d3.axisBottom()
        .scale(newXScale);

    oldXAxis.transition()
        .duration(500)
        .call(newXAxis);

    const newYAxis = d3.axisLeft()
        .scale(newYScale);

    oldYAxis.transition()
        .duration(500)
        .call(newYAxis);
};

D3Bar.destroy = function destroy() {
    // Cleaning code
};

export default D3Bar;
