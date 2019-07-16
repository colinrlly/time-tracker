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
    // Populate pie chart
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

    // Fill date range with now and 1 week ago
    var startRange = moment().subtract(7, 'd').format('MM/DD/YYYY') +
        ' - ' + moment().format('MM/DD/YYYY');
    
    $('input[name="daterange"]').val(startRange);
})

$('.rangeTypeBtn').click(function () {
    $('.rangeTypeDropdownContent').show();
})

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.rangeTypeBtn')
        && $('.rangeTypeBtn').is(':visible')) {
            $('.rangeTypeDropdownContent').hide();
    }
}

$('.rangeTypeDropdownContent button').click(function (event) {
    $('.rangeTypeBtn').html($(this).html());
})

$('input[name="daterange"]').daterangepicker({
    opens: 'left'
}, function(start, end, label) {
    console.log('A new date selection was made: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
})
