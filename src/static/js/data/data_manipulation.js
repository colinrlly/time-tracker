// Manipulates and formats the data coming from the server

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

// Aggregates and formats a list of activity records.
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
