// Global varialbe to store the timer time.
var timer;

/**
 * Starts the timer interval. Uses javascript setInterval() to update the timer
 * every second.
 * 
 * @param {String} start_time Time to start the timer at.
 */
var start_timer = function(start_time) {
    if (!timer) {
        var now = moment(utc_now());
        start_time = moment(start_time)
        var diff = now - start_time;
        var interval = 1000;
        var duration = moment.duration(diff, 'milliseconds');

        timer = setInterval(function() {
            var seconds = ('0' + duration.seconds()).substr(-2, 2);
            var minutes = ('0' + duration.minutes()).substr(-2, 2);
            var hours = ('0' + duration.hours()).substr(-2, 2);
            var t = hours + ':' + minutes + ':' + seconds;

            $('p.time').html(t);
            duration = moment.duration(duration + interval, 'milliseconds');
        }, interval);
    }
}

/**
 * Signals if there timer is running or not.
 */
var timer_is_running = function() {
    if (timer) {
        return true;
    } else {
        return false;
    }
}

/**
 * Stops the timer by clearing the interval and setting global timer variable to null.
 */
var stop_timer = function() {
    clearInterval(timer);
    timer = null;
}

/**
 * Fades the timer in and out twice.
 */
var flash_timer = function() {
    $('p.time').fadeOut().fadeIn().fadeOut().fadeIn();
}

/**
 * Sets the p tag representing the timer to 00:00:00.
 */
var reset_timer = function() {
    $('p.time').html('00:00:00');
}

/**
 * Returns a Javascript date object representing 'now' in UTC time.
 */
function utc_now() {
    var d = new Date();

    return new Date(
        d.getUTCFullYear(),
        d.getUTCMonth(),
        d.getUTCDate(),
        d.getUTCHours(),
        d.getUTCMinutes(), 
        d.getUTCSeconds()
    );
}