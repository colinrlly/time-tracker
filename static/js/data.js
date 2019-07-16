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

    // Initialize date range picker
    $('input[name="daterange"]').daterangepicker({
        opens: 'left',
        startDate: moment().subtract(7, 'd').format('MM/DD/YYYY'),
        endDate: moment().format('MM/DD/YYYY')
    }, function(start, end, label) {
        console.log('A new date selection was made: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));

        $('input[name="daterange"]').data('start', start);
        $('input[name="daterange"]').data('end', end);
    })
    
    $('input[name="daterange"]').data('start', moment().subtract(7, 'd'));
    $('input[name="daterange"]').data('end', moment());
    $('input[name="daterange"]').data('rangeSize', 7);
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
    var selection = $(this).html();

    $('.rangeTypeBtn').html(selection);

    switch(selection) {
        case 'Today':
            setRange(getEndOfRange(), 0);
            $('input[name="daterange"]').data('rangeSize', 0);
            break;
        case 'Week':
            setRange(getEndOfRange(), 7);
            $('input[name="daterange"]').data('rangeSize', 7);
            break;
        case 'Month':
            setRange(getEndOfRange(), 30);
            $('input[name="daterange"]').data('rangeSize', 30);
            break;
        case '180 Days':
            setRange(getEndOfRange(), 180);
            $('input[name="daterange"]').data('rangeSize', 180);
            break;
        case 'Year':
            setRange(getEndOfRange(), 365);
            $('input[name="daterange"]').data('rangeSize', 365);
            break;
        // case 'All Time':
        //     setRange(moment(), 0);
        //     break;
        default:
            alert('Invalid Time Range');
    }
})

function setRange(endOfRange, rangeSize) {
    var startOfRange = moment(endOfRange).subtract(rangeSize, 'd');

    $('input[name="daterange"]').data('start', startOfRange);
    $('input[name="daterange"]').data('end', endOfRange);

    $('input[name="daterange"]').val(startOfRange.format('MM/DD/YYYY') + ' - ' + endOfRange.format('MM/DD/YYYY'));
}

function getStartOfRange() {
    return $('input[name="daterange"]').data('start');
}

function getEndOfRange() {
    return $('input[name="daterange"]').data('end');
}

function getRangeSize() {
    return $('input[name="daterange"]').data('rangeSize');
}

$('.rangeBackwardBtn').click(function () {
    setRange(getStartOfRange(), getRangeSize());
})

$('.rangeForwardBtn').click(function () {
    var rangeSize = getRangeSize();

    setRange(moment(getEndOfRange()).add(rangeSize, 'd'), rangeSize);
})
