import * as d3 from 'd3';

const D3Bar = {};

const myData = [
    { name: 'games', duration: 23.03 },
    { name: 'mag', duration: 12.05 },
    { name: 'roger', duration: 4.98 },
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
        .range([0, configuration.width - axisMarginLeft]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(myData.map((d) => d.duration))])
        .range([configuration.height - axisMarginBottom * 2, 0]);

    // chart.selectAll('rect')
    //     .data(myData, (d) => d.name)
    //     .enter()
    //     .append('rect')
    //     .attr('x', (d) => xScale(d.name))
    //     .attr('y', (d) => configuration.height - yScale(d.duration))
    //     .attr('width', xScale.bandwidth())
    //     .attr('height', (d) => yScale(d.duration));

    // Add scales to axis
    const xAxis = d3.axisBottom()
        .scale(xScale);

    // Append group and insert axis
    const xAxisTranslate = configuration.height - axisMarginBottom;

    chart.append('g')
        .attr('transform', `translate(${axisMarginLeft}, ${xAxisTranslate})`)
        .call(xAxis);

    const yAxis = d3.axisLeft()
        .scale(yScale);

    chart.append('g')
        .attr('transform', `translate(${axisMarginLeft}, ${axisMarginBottom})`)
        .call(yAxis);

    return chart;
};

D3Bar.update = function update(newData, configuration, chart) {
    const newXScale = d3.scaleBand()
        .domain(newData.map((d) => d.name))
        .range([0, configuration.width]);

    const newYScale = d3.scaleLinear()
        .domain([0, d3.max(newData.map((d) => d.duration))])
        .range([0, configuration.height]);

    const oldRects = chart.selectAll('rect')
        .data(newData, (d) => d.name);

    oldRects.enter()
        .append('rect')
        .merge(oldRects)
        .attr('x', (d) => newXScale(d.name))
        .attr('y', (d) => configuration.height - newYScale(d.duration))
        .attr('width', newXScale.bandwidth())
        .attr('height', (d) => newYScale(d.duration));

    oldRects.exit().remove();

    // Add labels
    chart.selectAll('text')
        .data(newData, (d) => d.name)
        .enter()
        .append('text')
        .attr('x', (d) => newXScale(d.name))
        .attr('y', configuration.height)
        .attr('width', newXScale.bandwidth())
        .attr('fill', 'red')
        .text('hi');

    // Add scales to axis
    const xAxis = d3.axisBottom()
        .scale(newXScale);

    // Append group and insert axis
    chart.append('g')
        .attr('transform', `translate(0, ${configuration.height - 100})`)
        .call(xAxis);

    const yAxis = d3.axisLeft()
        .scale(newYScale);

    chart.append('g')
        .attr('transform', 'translate(50, 0)')
        .call(yAxis);
};

D3Bar.destroy = function destroy() {
    // Cleaning code
};

export default D3Bar;
