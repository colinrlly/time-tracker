$('button.activity').click(function() {
    /* Sends the updated activity to the server and shows the stop button */
    $.post('/api/start-activity',
        {
            'activity': $(this).html()
        });

    $('button.stop').show();
});


$('button.stop').click(function() {
    /* Sends the stop-activity command to the server 
        and hides the stop button, and shows the save/delete buttons */
    $.post('/api/stop-activity');
    
    $('button.stop').hide();
    $('button.delete').show();
    $('button.save').show();
});


$('button.delete').click(function() {
    /* Does nothing in effect not saving the user's last event */
    $('button.delete').hide();
    $('button.save').hide();
});


$('button.save').click(function() {
    /* Tells the server to make a google calendar event 
        of the user's last stopped activity */
    $('button.delete').hide();
    $('button.save').hide();

    $.post('/api/save-activity');
});
