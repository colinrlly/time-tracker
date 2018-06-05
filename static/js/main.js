$('button.activity').click(function() {
    /* Sends the updated activity to the server and shows the stop button */
    $.post('/api/start-activity',
        {
            'activity': $(this).html()
        });

    $('button.stop').show();
    var act = $(this).html();
    act_name(act);
    start_timer(moment());
    
});

$('button.plus').click(function() {
    /* show the add activity overlay */
    $('div.overlay').show();   
});

$('button.add').click(function() {
    /* saves new activity, makes a button for it, and hides overlay */
    $('div.overlay').hide();   
});

$('button.close').click(function() {
    /* saves new activity, makes a button for it, and hides overlay */
    $('div.overlay').hide();   
});

$('button.stop').click(function() {
    /* Sends the stop-activity command to the server 
        and hides the stop button, and shows the save/delete buttons */
    $.post('/api/stop-activity');
    
    $('button.stop').hide();
    $('button.delete').show();
    $('button.save').show();
    
    stop_timer();
    flash_timer();
});


$('button.delete').click(function() {
    /* Does nothing in effect not saving the user's last event */
    $('button.delete').hide();
    $('button.save').hide();
    
    reset_timer();
    act_hide();
});


$('button.save').click(function() {
    /* Tells the server to make a google calendar event 
        of the user's last stopped activity */
    $('button.delete').hide();
    $('button.save').hide();

    $.post('/api/save-activity');
    
    reset_timer();
    act_hide();
});
