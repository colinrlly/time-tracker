$('.butt').on('click', '.activity', function () {
    /* Sends the updated activity to the server and shows the stop button */
    if (!timer_is_running()) {
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

$('button.stop').click(function () {
    /* Sends the stop-activity command to the server 
        and hides the stop button, and shows the save/delete buttons */
    $.post('/api/stop-activity');

    $('button.stop').hide();
    $('button.delete').show();
    $('button.save').show();

    stop_timer();
    flash_timer();
});

$('button.delete').click(function () {
    /* Does nothing in effect not saving the user's last event */
    $('button.delete').hide();
    $('button.save').hide();

    reset_timer();
    act_hide();

    // Show all the buttons
    $('a.activity').show();
});

$('button.save').click(function () {
    /* Tells the server to make a google calendar event 
        of the user's last stopped activity */
    $('button.delete').hide();
    $('button.save').hide();

    window.location.replace('/api/save-activity');

    // Show all the buttons
    $('a.activity').show();
});

$('.g-signout').click(function () {
    $.post('/logout', {}, function (redirect_url) {
        window.location.replace(redirect_url);
    });
});

// If the STOP button is shown when the page loads then we should set the timer
// to the time given by the server
if ($('button.stop').is(':visible')) {
    start_timer(START_TIME);
};
