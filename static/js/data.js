var pieChart;
var date_ranges = [];

// Aggregates and formats a list of activity records which usually comes from the server
function format_events(res) {
    // Get the duration of each event.
    var events = res.list.map(function (x) {
        var end = moment(x.end.dateTime);
        var start = moment(x.start.dateTime);

        return {
            'duration': end.diff(start, 'minutes'),
            'name': x['summary'],
            'colorId': x['colorId'],
            'inActivities': x['inActivities']
        };
    });

    // Aggregate the events together grouped by name.
    var agg_events = events.reduce(function (acc, curr) {
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
        agg_events_array.push({
            'name': event,
            'duration': (agg_events[event]['duration'] / 60).toFixed(2),
            'colorId': agg_events[event]['colorId'],
            'inActivities': agg_events[event]['inActivities']
        });
    }

    // Sort the array so the events show up in order of increasing duration.
    agg_events_array.sort(function (a, b) { return b['duration'] - a['duration'] });

    return agg_events_array;
}

// Function to run when a custom date range is selected.
function setCustomRange() {
    $('.rangeTypeBtn').html('Custom');
    $('.rangeBackwardBtn').hide();
    $('.rangeForwardBtn').hide();
}

// Function to run when a custom date range is de-selected.
function removeCustomRange() {
    $('.rangeBackwardBtn').show();
    $('.rangeForwardBtn').show();
}

$(document).ready(function () {
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

    // Populate pie chart
    $.post('/api/list_events', {
        'startOfRange': getStartOfRange().toISOString(),
        'endOfRange': getEndOfRange().toISOString(),
    }, function (json) {
        var res = JSON.parse(json);

        // console.log(res)

        var agg_events_array = format_events(res);

        var ctx = document.getElementById('myChart').getContext('2d');
        pieChart = new Chart(ctx, {
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
                legend: false,  // Don't show the default legend
                legendCallback: function (chart) {  // Instead create our own custom legend
                    var legendHtml = [];
                    legendHtml.push('<ul class="chartLegend">');

                    var item = chart.data.datasets[0];

                    for (var i = 0; i < item.data.length; i++) {
                        legendHtml.push('<li>');
                        legendHtml.push('<span class="chartLegendLabel" style="background-color:' + item.backgroundColor[i] + '">' + item.data[i] + ' hours - ' + chart.data.labels[i] + '</span>');
                        legendHtml.push('</li>');
                    }

                    legendHtml.push('</ul>');

                    return legendHtml.join("");
                }
            }
        });

        // Show / hide data slice on label click
        $(".chartLegend").on('click', "li", function() {
            var index = $(this).index();

            if (pieChart.getDatasetMeta(0).data[index].hidden) {
                pieChart.getDatasetMeta(0).data[index].hidden = false;
                $(this).css('text-decoration', 'none');
            } else {
                pieChart.getDatasetMeta(0).data[index].hidden = true;
                $(this).css('text-decoration', 'line-through');
            }
                            
            // We hid a dataset ... rerender the chart
            pieChart.update();
        })

        $('.chartLegend').html(pieChart.generateLegend());  // Call this to generate our own legend
    });
})

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

        // If the incomming data is for the most recently selected date range.
        if (res['start'] === date_ranges[date_ranges.length - 1]['start']
            && res['end'] === date_ranges[date_ranges.length - 1]['end']) {

            var agg_events_array = format_events(res);

            var ctx = document.getElementById('myChart').getContext('2d');
            pieChart.destroy();
            pieChart = new Chart(ctx, {
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
                options: {}
            });
        }
    });
}

// Shows the range type dropdown.
$('.rangeTypeBtn').click(function () {
    $('.rangeTypeDropdownContent').show();
})

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.rangeTypeBtn')
        && $('.rangeTypeBtn').is(':visible')) {
        $('.rangeTypeDropdownContent').hide();
    }
}

// Handles when the user chooses a new date range type from the dropdown.
$('.rangeTypeDropdownContent button').click(function (event) {
    var selection = $(this).html();

    $('.rangeTypeBtn').html(selection);

    switch (selection) {
        case 'Day':
            setRange(getEndOfRange(), 1);
            $('input[name="daterange"]').data('rangeSize', 1);
            removeCustomRange();
            break;
        case 'Week':
            setRange(getEndOfRange(), 7);
            $('input[name="daterange"]').data('rangeSize', 7);
            removeCustomRange();
            break;
        case 'Month':
            setRange(getEndOfRange(), 30);
            $('input[name="daterange"]').data('rangeSize', 30);
            removeCustomRange();
            break;
        case '180 Days':
            setRange(getEndOfRange(), 180);
            $('input[name="daterange"]').data('rangeSize', 180);
            removeCustomRange();
            break;
        case 'Year':
            setRange(getEndOfRange(), 365);
            $('input[name="daterange"]').data('rangeSize', 365);
            removeCustomRange();
            break;
        // Not sure how to define all time yet.
        // case 'All Time':
        //     setRange(moment(), 0);
        //     break;
        default:
            alert('Invalid Time Range');
    }
})

// Executes the flow for a newly selected date range.
function setRange(endOfRange, rangeSize) {
    var startOfRange = moment(endOfRange).subtract(rangeSize, 'd');

    $('input[name="daterange"]').data('start', startOfRange);
    $('input[name="daterange"]').data('end', endOfRange);

    $('input[name="daterange"]').data('daterangepicker').setStartDate(startOfRange.format('MM/DD/YYYY'));
    $('input[name="daterange"]').data('daterangepicker').setEndDate(endOfRange.format('MM/DD/YYYY'));

    updateChart();
}

// Returns the start of the current date range.
function getStartOfRange() {
    return $('input[name="daterange"]').data('start');
}

// Returns the end of the current date range.
function getEndOfRange() {
    return $('input[name="daterange"]').data('end');
}

// Returns the size of the current date range i.e. week, month, etc.
function getRangeSize() {
    return $('input[name="daterange"]').data('rangeSize');
}

// Handles clicking the range backwards button.
$('.rangeBackwardBtn').click(function () {
    setRange(getStartOfRange(), getRangeSize());
})

// Handles clicking the range forwards button.
$('.rangeForwardBtn').click(function () {
    var rangeSize = getRangeSize();
    setRange(moment(getEndOfRange()).add(rangeSize, 'd'), rangeSize);
})
