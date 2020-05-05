// If the STOP button is shown when the page loads then we should set the timer
// to the time given by the server
if ($('button.stop').is(':visible')) {
    start_timer(START_TIME);
};

/**
 * Starts an activity. Shows the stop button. Starts the timer.
 * 
 * Dependency on timer-v0.js.
 */
$('.butt').on('click', '.activity', function () {
    /* Sends the updated activity to the server and shows the stop button */
    if (!timer_is_running()) {
        // TODO: This should handle cases when there is an error and when the start is successful
        $.post('/api/start-activity',
            {
                'activity_id': $(this).attr('id')
            });

        $('button.stop').show();

        var act = $(this).find('span').html();
        act_name(act);
        start_timer(moment(utc_now()));

        // Hide all the buttons when timer is running
        $('.activity').hide();
    }
});

/**
 * Sends the stop-activity command to the server and hides
 * the stop button. Shows the save/delete buttons.
 */
$('button.stop').click(function () {
    /* Sends the stop-activity command to the server 
        and hides the stop button, and shows the save/delete buttons */
    $.post('/api/stop-activity', {}, function (json) {
        var res = JSON.parse(json);

        if (res['code'] === 'success') {
            $('button.stop').hide();
            $('button.delete').show();
            $('button.save').show();
        
            stop_timer();
            flash_timer();
        } else {
            window.alert('There was a problem stopping your activity.');
        }
    });
});

/**
 * Deletes the users stopped activity record. Actually just hides the
 * save and delete buttons, the activity name, and resets the timer.
 */
$('button.delete').click(function () {
    $('button.delete').hide();
    $('button.save').hide();

    reset_timer();
    act_hide();

    // Show all the buttons
    $('a.activity').show();
});

/**
 * Tells the server to make a Google Calendar event of the user's last
 * stopped acitivty.
 */
$('button.save').click(function () {
    $.post('/api/save-activity', {}, function (json) {
        var res = JSON.parse(json);

        if (res['code'] === 'success') {
            $('button.delete').hide();
            $('button.save').hide();
            $('a.activity').show();
            reset_timer();
            act_hide();
        } else if (res['code'] === 'need_authorization') {
            console.log(res);
            window.location.replace(res['auth_url']);
        } else {
            window.alert('There was a problem saving your activity.');
        }
    });
});

/**
 * Signs the user out.
 */
$('.g-signout').click(function () {
    $.post('/logout', {}, function (redirect_url) {
        window.location.replace(redirect_url);
    });
});