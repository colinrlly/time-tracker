import * as d3 from 'd3';

const D3Bar = {};

var myData = [21, 3, 5, 21, 15];

D3Bar.create = function create(svgNode, data, configuration) {
    // D3 code to create the bar chart
    var xScale = d3.scale.ordinal()
        .domain(d3.range(myData.length))
        .rangeRoundBands([0, w], 0.05);

    let yScale = d3.scale.linear()
        .domain([0, d3.max(myData)])
        .range([0, h]);

    let svg = d3.select(svgNode);

    svg.selectAll("rect")
        .data(myData)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return xScale(i);
        })
        .attr("y", function (d) {
            return h - yScale(d);
        })
        .attr("width", xScale.rangeBand())
        .attr("height", function (d) {
            return yScale(d);
        })
        .attr("fill", "steelblue");

    // Select the svg element.
    // const svg = d3.select(svgNode);

    // // Add margin and padding to svg.
    // const chart = svg.append('g')
    //     .attr('transform', `translate(${configuration.margin}, ${configuration.margin})`);

    // // Scale the x axis.
    // const xScale = d3.scaleBand() // Scale band splits the range into bands.
    //     .range([0, configuration.width])
    //     .domain(data.map((s) => s.name))
    //     .padding(0.4);

    // // Scale the y axis.
    // const yScale = d3.scaleLinear()
    //     .range([configuration.height, 0])
    //     .domain([0, 100]);

    // Create the axis.
    // chart.append('g')
    //     .attr('transform', `translate(0, ${configuration.height})`)
    //     .call(d3.axisBottom(xScale));
    // chart.append('g')
    //     .call(d3.axisLeft(yScale));

    // // Create the lines on the left axis.
    // const makeYLines = () => d3.axisLeft()
    //     .scale(yScale);
    // chart.append('g')
    //     .attr('class', 'grid')
    //     .call(makeYLines()
    //         .tickSize(-configuration.width, 0, 0)
    //         .tickFormat(''));

    // Create the element to represent the bars in the chart.
    // const barGroups = chart.selectAll('rect')
    //     .data(data)
    //     .enter()
    //     .append('rect');

    // // Give the bars in the chart height and width.
    // barGroups
    //     .append('rect')
    //     // .attr('class', 'bar')
    //     .attr('x', (g) => xScale(g.name))
    //     .attr('y', (g) => yScale(g.duration))
    //     .attr('height', (g) => configuration.height - yScale(g.duration))
    //     .attr('width', xScale.bandwidth())
    //     .attr('fill', 'steelblue');

    // // Give the bars text
    // barGroups
    //     .append('text')
    //     .attr('class', 'duration')
    //     .attr('x', (a) => xScale(a.name) + xScale.bandwidth() / 2)
    //     .attr('y', (a) => yScale(a.duration) + 30)
    //     .attr('text-anchor', 'middle')
    //     .text((a) => `${a.duration}%`);

    // // Create left text label.
    // svg.append('text')
    //     .attr('class', 'label')
    //     .attr('x', -(configuration.height / 2) - configuration.margin)
    //     .attr('y', configuration.margin / 2.4)
    //     .attr('transform', 'rotate(-90)')
    //     .attr('text-anchor', 'middle')
    //     .text('Love meter (%)');

    // // Create bottom text label.
    // svg.append('text')
    //     .attr('class', 'label')
    //     .attr('x', configuration.width / 2 + configuration.margin)
    //     .attr('y', configuration.height + configuration.margin * 1.7)
    //     .attr('text-anchor', 'middle')
    //     .text('names');

    // // Create the top label.
    // svg.append('text')
    //     .attr('class', 'title')
    //     .attr('x', configuration.width / 2 + configuration.margin)
    //     .attr('y', 40)
    //     .attr('text-anchor', 'middle')
    //     .text('Most loved programming names in 2018');

    // // Create bottom right text label.
    // svg.append('text')
    //     .attr('class', 'source')
    //     .attr('x', configuration.width - configuration.margin / 2)
    //     .attr('y', configuration.height + configuration.margin * 1.7)
    //     .attr('text-anchor', 'start')
    //     .text('Source: Stack Overflow, 2018');

    return {
        chart,
        xScale,
        yScale,
    };
};

D3Bar.update = function update(element, newData, configuration, chart, xScale, yScale) {
    const barGroups = chart.selectAll('rect')
        .data(newData);

    barGroups.enter()
        .append('rect');

    barGroups.transition()
        .duration(300)
        .attr('x', (g) => xScale(g.name))
        .attr('y', (g) => yScale(g.duration))
        .attr('height', (g) => configuration.height - yScale(g.duration))
        .attr('width', xScale.bandwidth());

    barGroups.exit()
        .remove();
};

D3Bar.destroy = function destroy() {
    // Cleaning code
};

export default D3Bar;
