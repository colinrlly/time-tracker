$('.butt').on('click', 'button.activity', function() {
    /* Sends the updated activity to the server and shows the stop button */
    if (!timer_is_running()) {
        $.post('/api/start-activity',
        {
            'activity_id': $(this).data('activity-id')
        });

        $('button.stop').show();
        var act = $(this).html();
        act_name(act);
        start_timer(moment(utc_now()));
        
        // Hide all the buttons when timer is running
        $('button.activity').hide();
    }
});

$('button.plus').click(function() {
    /* show the add activity overlay */
    
    $('div.blur').addClass('frost');
    $('div.overlay').show();
    $('div.overlayout').show();
    $('button.activity').prop("disabled",true);
});

$('button.add').click(function() {
    /* saves new activity, makes a button for it, and hides overlay */
    $('div.overlay').hide();
    $('div.blur').removeClass('frost');

    var name = $('input.Activity_Names').val();
    var color = $('button.selectedcolor').attr('name');

    $.post('/api/create-activity', {'activity': name, 'color': color}, function(json) {
        data = JSON.parse(json);

        if (data['successfull'] == 'true') {
            $('div.butt').append(
                '<button class="activity" data-activity-id=' + data['activity_id'] + '>' + name + '</button>'
            );
        } else {
            window.alert('New activity cannot be a duplicate');
        }
    });
});

// Get the modal
var overlay = $('.overlay');
var overlayout = $('.overlayout');
var plus = document.querySelector('.plus');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if ($(event.target).parent().get(0) != overlay.get(0) && event.target != plus && $(event.target).get(0) != overlay.get(0)) {
        overlay.hide();
        overlayout.hide();
        $('div.blur').removeClass('frost');
        $('button.activity').prop("disabled",false);
    }
}

$('button.color').click(function() {
    $('button.selectedcolor').removeClass('selectedcolor');
    $(this).addClass('selectedcolor');
});

$('button.close').click(function() {
    /* Closes add activity dialog. */
    $('div.overlay').hide();
    $('div.blur').removeClass('frost');
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
    
    // Show all the buttons
    $('button.activity').show();
});

$('button.save').click(function() {
    /* Tells the server to make a google calendar event 
        of the user's last stopped activity */
    $('button.delete').hide();
    $('button.save').hide();

    window.location.replace('/api/save-activity');
    
    // Show all the buttons
    $('button.activity').show();
});

function onSignIn(google_user) {
    $.post('/login', {'token': google_user.getAuthResponse().id_token}, function(redirect_url) {
        window.location.replace(redirect_url);
    });
};

$('.g-signout').click(function() {
    auth2.signOut().then(function() {
        $.post('/logout', {}, function(redirect_url) {
            window.location.replace(redirect_url);
        });
    });
});

gapi.load('auth2', function() {
    auth2 = gapi.auth2.init({
        client_id: '379069589012-e6278tvlf5qsj797mq2kuhkbhkgqmotm.apps.googleusercontent.com'
    })

    // Load in Google profile picture
    setTimeout(function() {
        $('body > div.options_cirlce')
            .css('background-image', 'url(' + auth2.currentUser.Ab.w3.Paa + ')')
            .show();
    }, 300);
});

// If the STOP button is shown when the page loads then we should set the timer
// to the time given by the server
if ($('button.stop').is(':visible')) {
    start_timer(START_TIME);
};
