import * as d3 from 'd3';

import googleColors from '../../../../../static/js/google_colors';
import formatLabels from './formatLabels';

const D3StackedBar = {};

const myData = [];

D3StackedBar.create = function create(barChartContainer, configuration) {
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

D3StackedBar.update = function update(newData, configuration, chart, filteredTotals, names, range) {
    const stack = d3.stack()
        .keys(filteredTotals.map((total) => total.name))
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

    const series = stack(newData);

    const stackedData = [];

    series.forEach((layer) => {
        layer.forEach((d, i) => {
            if (d[0] !== d[1]) {
                stackedData.push({
                    name: layer.key,
                    fullName: layer.key, // Here to mirror the bar chart attribute.
                    y1: d[0],
                    y2: d[1],
                    rangeBeginning: newData[i].rangeBeginning,
                });
            }
        });
    });

    const tooltip = d3.select('.tooltipHook');

    chart.attr('width', configuration.width)
        .attr('height', configuration.height);

    let newXScale = d3.scaleBand()
        .domain(newData.map((d) => d.rangeBeginning))
        .range([0, configuration.width - configuration.margin.left])
        .padding(configuration.barGutter)
        .paddingOuter(configuration.paddingOuter);

    const formattedData = formatLabels(stackedData, newXScale.bandwidth(), range);

    newXScale = newXScale.domain(formattedData.map((d) => d.rangeBeginning));

    const newYScale = d3.scaleLinear()
        .domain([0, d3.max(stackedData.map((d) => d.y2))])
        .range([configuration.height - configuration.margin.bottom * 2, 0])
        .nice();

    const oldRects = chart.selectAll('rect')
        .data(formattedData, (d) => d.rangeBeginning);

    oldRects.exit()
        .remove();

    oldRects.enter()
        .append('rect')
        .merge(oldRects)
        .attr('x', (d) => newXScale(d.rangeBeginning) + configuration.margin.left)
        .attr(
            'y',
            (d) => newYScale(d.y2)
                + configuration.margin.bottom
                + configuration.barVerticleSpacing,
        )
        .attr('height', (d) => newYScale(d.y1)
            - newYScale(d.y2)
            - (((newYScale(d.y1) - newYScale(d.y2) - configuration.barVerticleSpacing) > 0)
                ? configuration.barVerticleSpacing : 0))
        .attr('width', newXScale.bandwidth())
        .attr('fill', (d) => googleColors[names[d.name].colorId])
        .on('mouseover', (d) => {
            tooltip.text(`${d.name} ${(d.y2 - d.y1).toFixed(2)}h`);
            tooltip.style('visibility', 'visible');

            d3.selectAll('rect')
                .attr('fill-opacity', (d2) => {
                    if (d.fullName !== d2.fullName) {
                        return 0.3;
                    }

                    return 1;
                });
        })
        .on('mousemove', () => tooltip.style('top',
            `${d3.event.pageY - 10}px`).style('left', `${d3.event.pageX + 10}px`))
        .on('mouseout', () => {
            tooltip.style('visibility', 'hidden');

            d3.selectAll('rect').attr('fill-opacity', 1);
        });

    // Add scales to axis
    const oldXAxis = chart.select('#xAxis');
    const oldYAxis = chart.select('#yAxis');

    const newXAxis = d3.axisBottom()
        .scale(newXScale);

    oldXAxis.call(newXAxis
        .tickSize(0)
        .tickPadding(10));

    const newYAxis = d3.axisLeft()
        .scale(newYScale);

    oldYAxis.call(newYAxis
        .tickSize(-configuration.width)
        .tickSizeOuter(0)); // Get rid of permanent end tick
};

D3StackedBar.destroy = function destroy() {
    // Cleaning code
};

export default D3StackedBar;
