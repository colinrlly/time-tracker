var pieChart;
var barChart;
var date_ranges = [];

// Get the duration of each event.
function get_durations(res) {
    return res.list.map(function (x) {
        var end = x.end.moment;
        var start = x.start.moment;

        return {
            'duration': end.diff(start, 'minutes'),
            'name': x['summary'],
            'colorId': x['colorId'],
            'inActivities': x['inActivities']
        };
    });
}

// Aggregates and formats a list of activity records which usually comes from the server
function format_events(events) {
    var events_w_duration = get_durations(events);

    // Aggregate the events together grouped by name.
    var agg_events = events_w_duration.reduce(function (acc, curr) {
        var curr_name = curr['name'];

        if (!acc[curr_name]) {
            acc[curr_name] = {
                'duration': 0,
                'colorId': curr['colorId'],
                'inActivities': curr['inActivities']
            };
        }

        acc[curr_name]['duration'] += curr['duration'];

        return acc;
    }, {});

    // Turn the dictionary of aggregated events into an array.
    var agg_events_array = [];
    for (var event in agg_events) {
        if (agg_events[event]['duration'] !== 0) {  // Get rid of events with 0 duration (all-day)
            agg_events_array.push({
                'name': event,
                'duration': (agg_events[event]['duration'] / 60).toFixed(2),
                'colorId': agg_events[event]['colorId'],
                'inActivities': agg_events[event]['inActivities']
            });
        }
    }

    // Sort the array so the events show up in order of increasing duration.
    agg_events_array.sort(function (a, b) { return b['duration'] - a['duration'] });

    return agg_events_array;
}

// Intitializes the date range picker and sets the initial date range.
function initialize_date_range_picker() {
    // Initialize date range picker
    $('input[name="daterange"]').daterangepicker({
        opens: 'left',
        startDate: moment().subtract(7, 'd').format('MM/DD/YYYY'),
        endDate: moment().format('MM/DD/YYYY')
    }, function (start, end, label) {
        $('input[name="daterange"]').data('start', start);
        $('input[name="daterange"]').data('end', end);

        setCustomRange();

        updateChart();
    })

    // Set initial date range data
    $('input[name="daterange"]').data('start', moment().subtract(7, 'd'));
    $('input[name="daterange"]').data('end', moment());
    $('input[name="daterange"]').data('rangeSize', 7);
}

// Intitializes the time range picker and sets the initial time range.
function initialize_time_range_picker() {
    // Intialize time range picker
    $('input[name="timerange"]').daterangepicker({
        timePicker: true,
        locale: {
            format: 'hh:mm A'
        }
    }, function (start, end, label) {
        $('input[name="timerange"]').data('start', start);
        $('input[name="timerange"]').data('end', end);

        updateChart();
    }).on('show.daterangepicker', function (ev, picker) {
        picker.container.find(".calendar-table").hide();
    });

    // Set initial time range
    $('input[name="timerange"]').data('start', moment().startOf('day'));
    $('input[name="timerange"]').data('end', moment().endOf('day'));    
}

$(document).ready(function () {
    // Initialize range pickers
    initialize_date_range_picker();
    initialize_time_range_picker();

    // Populate pie chart with initial data
    updateChart();
})

// Show / hide data slice on label click
function handleLabelClick(event, index) {
    // Hides a data set in the charts.
    if (pieChart.getDatasetMeta(0).data[index].hidden) {
        pieChart.getDatasetMeta(0).data[index].hidden = false;
        barChart.getDatasetMeta(0).data[index].hidden = false;
        $(event.target).css('text-decoration', 'none');
    } else {
        pieChart.getDatasetMeta(0).data[index].hidden = true;
        barChart.getDatasetMeta(0).data[index].hidden = true;
        $(event.target).css('text-decoration', 'line-through');
    }

    // We hid a dataset ... rerender the charts
    pieChart.update();
    barChart.update();
}

// Updates the pie chart to show new data.
function updateChart() {
    // Add the new date range to the date_ranges array.
    // This array is used to keep track of the last selected date range,
    // so if the data returns from the server out of order this array is used to
    // update using only the most recent date range.
    date_ranges.push({ 'start': getStartOfRange().toISOString(), 'end': getEndOfRange().toISOString() });

    // Ask the server for the events in a specified date range.
    $.post('/api/list_events', {
        'startOfRange': getStartOfRange().toISOString(),
        'endOfRange': getEndOfRange().toISOString(),
    }, function (json) {
        var res = JSON.parse(json);

        console.log(res)

        // If the incomming data is for the most recently selected date range.
        if (res['start'] === date_ranges[date_ranges.length - 1]['start']
            && res['end'] === date_ranges[date_ranges.length - 1]['end']) {

            var events_in_timerange = filter_events(getStartOfTimeRange(), getEndOfTimeRange(), res);

            var agg_events_array = format_events(events_in_timerange);

            console.log(agg_events_array);

            // Create pie chart
            var pieChartCtx = document.getElementById('pieChart').getContext('2d');
            if (pieChart) { pieChart.destroy(); }
            pieChart = new Chart(pieChartCtx, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: agg_events_array.map(function (x) { return x.duration; }),
                        backgroundColor: agg_events_array.map(function (x) {
                            return google_colors[x.colorId];
                        })
                    }],

                    // These labels appear in the legend and in the tooltips when hovering different arcs
                    labels: agg_events_array.map(function (x) { return x.name; })
                },
                options: {
                    legend: false,  // Don't show the default legend...
                    legendCallback: function (chart) {  // ...Instead create our own custom legend
                        var legendHtml = [];

                        // Log activities ul
                        legendHtml.push('<h3>Log Activities</h3>')
                        legendHtml.push('<ul class="chartLegend">');
                        for (var i = 0; i < agg_events_array.length; i++) {
                            if (agg_events_array[i].inActivities) {
                                legendHtml.push('<li>');
                                legendHtml.push('<span'
                                    + ' class="chartLegendLabel"'
                                    + ' onClick="handleLabelClick(event, ' + i + ')"'
                                    + ' style="background-color:' + google_colors[agg_events_array[i].colorId] + '">'
                                    + agg_events_array[i].name + ' hours - ' + agg_events_array[i].duration
                                    + '</span>');
                                legendHtml.push('</li>');
                            }
                        }
                        legendHtml.push('</ul>');

                        // Other Google Calendar activities ul
                        legendHtml.push('<h3>Other Google Calendar Activities</h3>')
                        legendHtml.push('<ul class="chartLegend">');
                        for (var i = 0; i < agg_events_array.length; i++) {
                            if (!agg_events_array[i].inActivities) {
                                legendHtml.push('<li class="otherGCActivtyLabel">');
                                legendHtml.push('<span'
                                    + ' class="chartLegendLabel"'
                                    + ' onClick="handleLabelClick(event, ' + i + ')"'
                                    + ' style="background-color:' + google_colors[agg_events_array[i].colorId] + '">'
                                    + agg_events_array[i].name + ' hours - ' + agg_events_array[i].duration
                                    + '</span>');
                                legendHtml.push('</li>');
                            }
                        }
                        legendHtml.push('</ul>');

                        return legendHtml.join("");
                    }
                }
            });

            // Create bar chart
            var barChartCtx = document.getElementById('barChart').getContext('2d');
            if (barChart) { barChart.destroy(); }
            barChart = new Chart(barChartCtx, {
                type: 'bar',
                data: {
                    datasets: [{
                        data: agg_events_array.map(function (x) { return x.duration; }),
                        backgroundColor: agg_events_array.map(function (x) {
                            return google_colors[x.colorId];
                        })
                    }],

                    // These labels appear in the legend and in the tooltips when hovering different arcs
                    labels: agg_events_array.map(function (x) { return x.name; })
                },
                options: {
                    // legend: false,  // Don't show the default legend
                    scales: {
                        xAxes: [{
                            stacked: true,
                        }],
                        yAxes: [{
                            stacked: true,
                        }]
                    }
                }
            });

            // Call this to generate our own legend
            $('.chartLegend').html(pieChart.generateLegend());

            // Hide and line-through all other Google Calendar activities.
            for (var i = 0; i < agg_events_array.length; i++) {
                if (!agg_events_array[i].inActivities) {
                    pieChart.getDatasetMeta(0).data[i].hidden = true;
                    barChart.getDatasetMeta(0).data[i].hidden = true;
                    $('.otherGCActivtyLabel span').css('text-decoration', 'line-through');
                }
            }

            // Update charts after we hide all other Google Calendar Activities.
            pieChart.update();
            barChart.update();
        }
    });
}
