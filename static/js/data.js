function format_events(res) {
        var events = res.list.map(function (x) {
            var end = moment(x.end.dateTime);
            var start = moment(x.start.dateTime);

            return {
                'duration': end.diff(start, 'minutes'),
                'name': x['summary'],
                'colorId': x['colorId']
            };
        });

        var agg_events = events.reduce(function (acc, curr) {
            var curr_name = curr['name'];

            if (!acc[curr_name]) {
                acc[curr_name] = {'duration': 0, 'colorId': curr['colorId']};
            }

            acc[curr_name]['duration'] += curr['duration'];

            return acc;
        }, {});

        var agg_events_array = [];
        for (var event in agg_events) {
            agg_events_array.push({
                'name': event,
                'duration': agg_events[event]['duration'],
                'colorId': agg_events[event]['colorId']
            });
        }

        return agg_events_array;
}

$(document).ready(function () {
    $.post('/api/list_events', {}, function (json) {
        var res = JSON.parse(json);

        var agg_events_array = format_events(res);

        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
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
    });
})
