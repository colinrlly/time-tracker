$('button.activity').click(function() {
    $.post('/api/start-activity',
        {
            'activity': $(this).html()
        });
    $('button.stop').show();
});


$('button.stop').click(function() {
    $.post('/api/stop-activity');
    $('button.stop').hide();
});
