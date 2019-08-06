var pieChart;
var date_ranges = [];

function minutes_of_day(m) {
    return m.minutes() + m.hours() * 60;
}

// Filter events by time range
function filter_events(start_time, end_time, events) {
    var indexes_to_remove = [];

    for (var i = 0; i < events.list.length; i++) {
        // Convert event times to moment objects
        events.list[i].start.moment = moment(events.list[i].start.dateTime);
        events.list[i].end.moment = moment(events.list[i].end.dateTime);

        // Remove Google dateTimes from event objects
        delete events.list[i].start.dateTime;
        delete events.list[i].start.timeZone;
        delete events.list[i].end.dateTime;
        delete events.list[i].end.timeZone;

        var esm = minutes_of_day(events.list[i].start.moment); // event start minutes
        var eem = minutes_of_day(events.list[i].end.moment); // event end minutes
        var sm = minutes_of_day(start_time); // start time minutes
        var em = minutes_of_day(end_time); // end time minutes

        if (esm < sm && eem < sm) { // Both before time range
            // Remove event from list
            indexes_to_remove.unshift(i);
        } else if (esm < sm && eem > sm & eem < em) { // Start before time range, end in time range
            // Change start time to time range start
            events.list[i].start.moment.hours(start_time.hours());
            events.list[i].start.moment.minutes(start_time.minutes());
        } else if (esm < sm && eem > em) { // Start before time range, end after time range
            // Change start time to time range start
            events.list[i].start.moment.hours(start_time.hours());
            events.list[i].start.moment.minutes(start_time.minutes());
            
            // Change end time to time range end
            events.list[i].end.moment.hours(end_time.hours());
            events.list[i].end.moment.minutes(end_time.minutes());
        } else if (esm > sm && esm < em && eem > em) { // Start in time range, end after time range
            // Chang end time to time range end
            events.list[i].end.moment.hours(end_time.hours());
            events.list[i].end.moment.minutes(end_time.minutes());
        } else if (esm > em && eem > em) { // Both after time range
            // Remove event from list
            indexes_to_remove.unshift(i);
        } else if (esm > sm && esm < em && eem > sm && eem < em) { // Both in time range
            // Everything is gucci
        }
    }

    // We push the indexes to remove onto the front of the array so when we
    // remove them the order of the array doesn't get messed up.
    for (var i = 0; i < indexes_to_remove.length; i++) {
        events.list.splice(indexes_to_remove[i], 1);
    }

    return events;
}

// Aggregates and formats a list of activity records which usually comes from the server
function format_events(res) {
    // Get the duration of each event.
    var events = res.list.map(function (x) {
        var end = x.end.moment;
        var start = x.start.moment;

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

    // Populate pie chart with initial data
    updateChart();
})

// Show / hide data slice on label click
function handleLabelClick(event, index) {
    if (pieChart.getDatasetMeta(0).data[index].hidden) {
        pieChart.getDatasetMeta(0).data[index].hidden = false;
        $(event.target).css('text-decoration', 'none');
    } else {
        pieChart.getDatasetMeta(0).data[index].hidden = true;
        $(event.target).css('text-decoration', 'line-through');
    }

    // We hid a dataset ... rerender the chart
    pieChart.update();
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

        // console.log(res)

        // If the incomming data is for the most recently selected date range.
        if (res['start'] === date_ranges[date_ranges.length - 1]['start']
            && res['end'] === date_ranges[date_ranges.length - 1]['end']) {

            var events_in_timerange = filter_events(getStartOfTimeRange(), getEndOfTimeRange(), res);

            var agg_events_array = format_events(events_in_timerange);

            // Create pie chart
            var ctx = document.getElementById('myChart').getContext('2d');
            if (pieChart) { pieChart.destroy(); }
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

            // Call this to generate our own legend
            $('.chartLegend').html(pieChart.generateLegend());

            // Hide and line-through all other Google Calendar activities.
            for (var i = 0; i < agg_events_array.length; i++) {
                if (!agg_events_array[i].inActivities) {
                    pieChart.getDatasetMeta(0).data[i].hidden = true;
                    $('.otherGCActivtyLabel span').css('text-decoration', 'line-through');
                }
            }

            // Update pieChart after we hide all other Google Calendar Activities.
            pieChart.update();
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

// Returns the start of the current time range.
function getStartOfTimeRange() {
    return $('input[name="timerange"]').data('start');
}

// Returns the end of the current time range.
function getEndOfTimeRange() {
    return $('input[name="timerange"]').data('end');
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
