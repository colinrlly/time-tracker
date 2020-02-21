import * as d3 from 'd3';

const D3Bar = {};

const myData = [
    { name: 'games', duration: 23.03 },
    { name: 'mag', duration: 12.05 },
    { name: 'roger', duration: 4.98 },
];

D3Bar.create = function create(svgNode, data, configuration) {
    const names = myData.map((d) => d.name);

    console.log(names);

    const xScale = d3.scaleBand()
        .domain(names)
        .range([0, configuration.width]);

    console.log(xScale('games'));
    console.log(xScale('mag'));
    console.log(xScale('roger'));
    console.log(xScale.bandwidth());

    const durations = myData.map((d) => d.duration);

    console.log(`durations: ${JSON.stringify(durations)}`);
    console.log(`height: ${configuration.height}`);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(durations)])
        .range([0, configuration.height]);

    console.log(`yScale(23.03): ${yScale(23.03)}`);
    console.log(`yScale(12.05): ${yScale(12.05)}`);
    console.log(`yScale(4.98): ${yScale(4.98)}`);

    const chart = d3.select(svgNode);

    chart.selectAll('rect')
        .data(myData, (d) => d.name)
        .enter()
        .append('rect')
        .attr('x', (d) => xScale(d.name))
        .attr('y', (d) => configuration.height - yScale(d.duration))
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => yScale(d.duration));

    return {
        chart,
        xScale,
        yScale,
    };
};

D3Bar.update = function update(element, newData, configuration, chart, xScale, yScale) {
    const newXScale = d3.scaleOrdinal()
        .domain(myData.map((d, i) => d.name))
        .range([0, configuration.width]);

    const durations = newData.map((x) => x.duration);

    const newYScale = d3.scaleLinear()
        .domain([0, d3.max(durations)])
        .range([configuration.height, 0]);

    const rects = chart.selectAll('rect')
        .data(newData, (d, i) => d.name);

    const enterRects = rects.enter()
        .append('rect')
        .attr('x', (d, i) => newXScale(d.name))
        .attr('y', (d) => configuration.height - newYScale(d.duration))
        .attr('width', xScale.rangeBands())
        .attr('height', (d) => newYScale(d.duration));

    enterRects.exit()
        .remove();
};

D3Bar.destroy = function destroy() {
    // Cleaning code
};

export default D3Bar;
