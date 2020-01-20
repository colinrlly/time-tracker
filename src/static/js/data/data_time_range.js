// Returns the minutes in a day for a moment object.
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

    // We pushed the indexes to remove onto the front of this array so when we
    // remove them the order of the array doesn't get messed up.
    for (var i = 0; i < indexes_to_remove.length; i++) {
        events.list.splice(indexes_to_remove[i], 1);
    }

    console.log(events);
    return events;
}

// Returns the start of the current time range.
function getStartOfTimeRange() {
    return $('input[name="timerange"]').data('start');
}

// Returns the end of the current time range.
function getEndOfTimeRange() {
    return $('input[name="timerange"]').data('end');
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
    initialize_time_range_picker();
})
