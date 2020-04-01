import * as d3 from 'd3';
import googleColors from '../../../../../static/js/google_colors';
import formatLabels from './formatLabels';

const D3Bar = {};

const myData = [];

D3Bar.create = function create(barChartContainer, configuration) {
    const chart = d3.select(barChartContainer)
        .append('svg')
        .attr('width', configuration.width)
        .attr('height', configuration.height);

    const xScale = d3.scaleBand()
        .domain(myData.map((d) => d.name))
        .range([0, configuration.width - configuration.margin.left])
        .padding(0.3);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(myData.map((d) => d.duration))])
        .range([configuration.height - configuration.margin.bottom * 2, 0]);

    // Add scales to axis
    const xAxis = d3.axisBottom()
        .scale(xScale);

    // Append group and insert axis
    const xAxisTranslate = configuration.height - configuration.margin.bottom;

    chart.append('g')
        .attr('id', 'xAxis')
        .attr('transform', `translate(${configuration.margin.left}, ${xAxisTranslate})`)
        .call(xAxis);

    const yAxis = d3.axisLeft()
        .scale(yScale);

    chart.append('g')
        .attr('id', 'yAxis')
        .attr('transform', `translate(${configuration.margin.left}, ${configuration.margin.bottom})`)
        .call(yAxis);

    return chart;
};

D3Bar.update = function update(newData, configuration, chart) {
    const tooltip = d3.select('.tooltipHook');

    chart.attr('width', configuration.width)
        .attr('height', configuration.height);

    let newXScale = d3.scaleBand()
        .domain(newData.map((d) => d.name))
        .range([0, configuration.width - configuration.margin.left])
        .padding(0.15)
        .paddingOuter(0.75);

    // Format the labels based on the bandwidth then reset the x domain.
    const formattedData = formatLabels(newData, newXScale.bandwidth());

    newXScale = newXScale
        .domain(formattedData.map((d) => d.name));

    const newYScale = d3.scaleLinear()
        .domain([0, d3.max(formattedData.map((d) => d.duration))])
        .range([configuration.height - configuration.margin.bottom * 2, 0])
        .nice();

    const oldRects = chart.selectAll('rect')
        .data(formattedData, (d) => d.name);

    oldRects.exit()
        .remove();

    const rects = oldRects.enter()
        .append('rect')
        .merge(oldRects)
        .attr('x', (d) => newXScale(d.name) + configuration.margin.left)
        .attr('width', newXScale.bandwidth())
        .attr('y', () => newYScale(0) + configuration.margin.bottom)
        .attr('height', 0);

    rects.transition()
        .duration(500)
        .attr('height', (d) => configuration.height - newYScale(d.duration) - configuration.margin.bottom * 2)
        .attr('y', (d) => newYScale(d.duration) + configuration.margin.bottom)
        .attr('fill', (d) => googleColors[d.colorId]);

    rects.on('mouseover', (d) => {
        tooltip.text(`${d.fullName} ${d.duration.toFixed(2)}h`);
        tooltip.style('visibility', 'visible');
    })
        .on('mousemove', () => tooltip.style('top',
            `${d3.event.pageY - 10}px`).style('left', `${d3.event.pageX + 10}px`))
        .on('mouseout', () => tooltip.style('visibility', 'hidden'));


    // Add scales to axis
    const oldXAxis = chart.select('#xAxis');
    const oldYAxis = chart.select('#yAxis');

    const newXAxis = d3.axisBottom()
        .scale(newXScale);

    oldXAxis.transition()
        .duration(500)
        .call(newXAxis
            .tickSize(0)
            .tickPadding(10));

    const newYAxis = d3.axisLeft()
        .scale(newYScale);

    oldYAxis.transition()
        .duration(500)
        .call(newYAxis
            .tickSize(-configuration.width)
            .tickSizeOuter(0)); // Get rid of permanent end tick
};

D3Bar.destroy = function destroy() {
    // Cleaning code
};

export default D3Bar;
