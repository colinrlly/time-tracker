// Class to create and manage a d3 bar chart

class Bar_Chart {
    constructor(opts) {
        // load in arguments from config object
        this.data = opts.data;
        this.element = opts.element;

        this.svgWidth = 500;
        this.svgHeight = 300;
        this.barPadding = 5;

        this.barWidth = (this.svgWidth / this.data.length);

        // create the chart
        this.draw();
    }

    draw() {
        var svg = this.element
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
}
