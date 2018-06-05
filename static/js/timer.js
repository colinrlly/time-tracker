var timer;

var start_timer = function(start_time) {
    if (!timer) {
        var now = moment();
        var diff = now - start_time;
        var interval = 1000;
        var duration = moment.duration(diff * 1000, 'milliseconds');

        timer = setInterval(function() {
            var seconds = ('0' + duration.seconds()).substr(-2, 2);
            var minutes = ('0' + duration.minutes()).substr(-2, 2);
            var hours = ('0' + duration.hours()).substr(-2, 2);
            var t = hours + ':' + minutes + ':' + seconds;

            $('span.time').html(t);
            duration = moment.duration(duration + interval, 'milliseconds');
        }, interval);
    }
}

var stop_timer = function() {
    clearInterval(timer);
    timer = null;
}

var flash_timer = function() {
    $('span.time').fadeOut().fadeIn().fadeOut().fadeIn();
}

var reset_timer = function() {
    $('span.time').html('00:00:00');
}