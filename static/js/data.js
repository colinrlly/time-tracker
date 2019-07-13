$(document).ready(function () {
    $.post('/api/list_events', {}, function (json) {
        var res = JSON.parse(json);

        var events = res.list.map(function (x) {
            var end = moment(x.end.dateTime);
            var start = moment(x.start.dateTime);
            return { 'duration': end.diff(start, 'minutes'), 'name': x.summary };
        });

        var agg_events = events.reduce(function (acc, curr) {
            if (!acc[curr.name]) {
                acc[curr.name] = 0;
            }

            acc[curr.name] += curr.duration;

            return acc;
        }, {});

        var agg_events_array = [];
        for (var event in agg_events) {
            agg_events_array.push({ 'name': event, 'duration': agg_events[event] });
        }

        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: agg_events_array.map(function (x) { return x.duration; }),
                    backgroundColor: [
                        '#ff6384',
                        '#36a2eb',
                        '#cc65fe',
                        '#ffce56',
                        '#ff6384',
                        '#36a2eb',
                        '#cc65fe',
                        '#ffce56'
                    ]
                }],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels:agg_events_array.map(function (x) { return x.name; })
            },
            options: {}
        });
    });
})
