import * as d3 from 'd3';

const D3Bar = {};

const sample = [
    {
        language: 'Rust',
        value: 78.9,
        color: '#000000',
    },
    {
        language: 'Kotlin',
        value: 75.1,
        color: '#00a2ee',
    },
    {
        language: 'Python',
        value: 68.0,
        color: '#fbcb39',
    },
    {
        language: 'TypeScript',
        value: 67.0,
        color: '#007bc8',
    },
    {
        language: 'Go',
        value: 65.6,
        color: '#65cedb',
    },
    {
        language: 'Swift',
        value: 65.1,
        color: '#ff6e52',
    },
    {
        language: 'JavaScript',
        value: 61.9,
        color: '#f9de3f',
    },
    {
        language: 'C#',
        value: 60.4,
        color: '#5d2f8e',
    },
    {
        language: 'F#',
        value: 59.6,
        color: '#008fc9',
    },
    {
        language: 'Clojure',
        value: 59.6,
        color: '#507dca',
    },
];

D3Bar.create = function create(svgNode, data, configuration) {
    // D3 code to create the bar chart
    const svg = d3.select(svgNode);

    const margin = 80;
    const width = 1000 - 2 * margin;
    const height = 600 - 2 * margin;

    const chart = svg.append('g')
        .attr('transform', `translate(${margin}, ${margin})`);

    const xScale = d3.scaleBand()
        .range([0, width])
        .domain(sample.map((s) => s.language))
        .padding(0.4)

    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 100]);

    // vertical grid lines
    // const makeXLines = () => d3.axisBottom()
    //   .scale(xScale)

    const makeYLines = () => d3.axisLeft()
        .scale(yScale)

    chart.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

    chart.append('g')
        .call(d3.axisLeft(yScale));

    // vertical grid lines
    // chart.append('g')
    //   .attr('class', 'grid')
    //   .attr('transform', `translate(0, ${height})`)
    //   .call(makeXLines()
    //     .tickSize(-height, 0, 0)
    //     .tickFormat('')
    //   )

    chart.append('g')
        .attr('class', 'grid')
        .call(makeYLines()
            .tickSize(-width, 0, 0)
            .tickFormat(''));

    const barGroups = chart.selectAll()
        .data(sample)
        .enter()
        .append('g');

    barGroups
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (g) => xScale(g.language))
        .attr('y', (g) => yScale(g.value))
        .attr('height', (g) => height - yScale(g.value))
        .attr('width', xScale.bandwidth());

    barGroups
        .append('text')
        .attr('class', 'value')
        .attr('x', (a) => xScale(a.language) + xScale.bandwidth() / 2)
        .attr('y', (a) => yScale(a.value) + 30)
        .attr('text-anchor', 'middle')
        .text((a) => `${a.value}%`);

    svg
        .append('text')
        .attr('class', 'label')
        .attr('x', -(height / 2) - margin)
        .attr('y', margin / 2.4)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Love meter (%)');

    svg.append('text')
        .attr('class', 'label')
        .attr('x', width / 2 + margin)
        .attr('y', height + margin * 1.7)
        .attr('text-anchor', 'middle')
        .text('Languages');

    svg.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + margin)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .text('Most loved programming languages in 2018');

    svg.append('text')
        .attr('class', 'source')
        .attr('x', width - margin / 2)
        .attr('y', height + margin * 1.7)
        .attr('text-anchor', 'start')
        .text('Source: Stack Overflow, 2018');
};

D3Bar.update = function update(element, data, configuration, chart) {
    // D3 code to update the chart
};

D3Bar.destroy = function destroy() {
    // Cleaning code
};

export default D3Bar;
