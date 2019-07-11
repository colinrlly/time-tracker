/**
 * Closes both the add activity and edit activity dialog. Removes the background blur and enables
 * all buttons on the page.
 */
function closeOverlay() {
    $('.overlay').hide();
    $('div.blur').removeClass('frost');
    $('a.activity').prop("disabled", false);
    $('button.plus').prop("disabled", false);
    $('button.edit_activity_btn').prop("disabled", false);
}

/**
 * Opens the add activity dialog, blurs the background, and dissables buttons on the page.
 */
$('button.plus').click(function (event) {
    /* show the add activity overlay */
    $('div.blur').addClass('frost');
    $('div.add_activity_dialog').show();
    $('a.activity').prop("disabled", true);
    $('button.edit_activity_btn').prop("disabled", true);
    $('button.plus').prop('disabled', true);

    event.stopPropagation();
});

/**
 * Saves new activity, makes a button for it, and hides overlay.
 * 
 * Shows an alert if the activity is a duplicate or empty.
 * 
 * TODO: Artificially added activity button needs edit activity button in it.
 */
$('button.add_activity_btn').click(function () {
    
    var name = $('.add_activity_dialog').find('input.activity_name').val();
    var color = $('.add_activity_dialog').find('button.selectedcolor').attr('name');

    $.post('/api/create-activity', { 'activity': name, 'color': color }, function (json) {
        data = JSON.parse(json);

        if (data['code'] == 'success') {
            $('div.butt').append(
                '<a class="activity" id=' + data['activity_id'] + '>'
                + '<span>' + name + '</span>'
                + '</a>'
            );

            closeOverlay();
        } else if (data['code'] == 'duplicate') {
            window.alert('New activity cannot be a duplicate.');
        } else if (data['code'] == 'empty') {
            window.alert('New actiity name cannot be empty.')
        }
    });
});

/**
 * The next few blocks deal with closing the overlays when the user clicks outside of them.
 */
// Get the modal
var add_activity_dialog = $('.add_activity_dialog');
var edit_activity_dialog = $('.edit_activity_dialog');
window.onclick = function (event) {
    // When the user clicks anywhere outside of the modal, close it
    var target = event.target;
    var parent = $(event.target).parent().get(0);
    var grand_parent = $(event.target).parent().parent().get(0);
    var great_grand_parent = $(event.target).parent().parent().parent().get(0);

    if (target != add_activity_dialog.get(0)
        && target != edit_activity_dialog.get(0)
        && parent != add_activity_dialog.get(0)
        && parent != edit_activity_dialog.get(0)
        && grand_parent != add_activity_dialog.get(0)
        && grand_parent != edit_activity_dialog.get(0)
        && great_grand_parent != add_activity_dialog.get(0)
        && great_grand_parent != edit_activity_dialog.get(0)) {

        closeOverlay();
    }
}

/**
 * Changes the selected color for an activity.
 * 
 * TODO: I'm pretty sure this will modify both the selected color in add activity dialog
 * and edit activity dialog.
 * 
 * UPDATE: It does.
 */
$('button.color').click(function () {
    $('button.selectedcolor').removeClass('selectedcolor');
    $(this).addClass('selectedcolor');
});

/**
 * Closes an activity dialog.
 */
$('button.close').click(function () {
    closeOverlay();
});

/**
 * Opens the edit activity dialog.
 * 
 * Performs a few things to set up the edit activity dialog, most importantly getting the
 * clicked acitivty name, color, and id.
 */
$('.butt').on('click', '.activity > button.edit_activity_btn', function (event) {
    // Add clicked activity name to edit activity dialog.
    var activity_name = $(this).parent().find('span').html();
    $('div.edit_activity_dialog').find('input.activity_name').val(activity_name);

    // Add clicked activity color to edit activity dialog.
    var activity_color = $(this).parent().data('color');
    $('div.edit_activity_dialog').find('.selectedcolor').removeClass('selectedcolor');
    $('div.edit_activity_dialog')
        .find('.color[name="' + activity_color + '"]')
        .addClass('selectedcolor');

    $('div.edit_activity_dialog').show();
    $('div.blur').addClass('frost');
    $('a.activity').prop("disabled", true);
    $('button.plus').prop("disabled", true);
    $('button.edit_activity_btn').prop("disabled", true);

    // Attatch activity_id to .edit_activity_dialog so it can sent to the server later.
    var activity_id = $(this).parent().attr('id');
    $('.edit_activity_dialog').data('edited_activity_id', activity_id);

    event.stopPropagation();
});

/**
 * Submits the new name and color of an activity to the server.
 * 
 * Has cases to handle when the activity name is a duplicate and when the
 * activity name is empty.
 */
$('.save_activity_edit_btn').click(function () {
    var activity_id = $('.edit_activity_dialog').data('edited_activity_id');
    var activity_name = $('div.edit_activity_dialog').find('input.activity_name').val();
    var activity_color = $('div.edit_activity_dialog').find('button.selectedcolor').attr('name');

    $.post('/api/save-activity-edit', {
        activity_id,
        new_name: activity_name,
        new_color: activity_color,
    }, function (json) {
        var res = JSON.parse(json);

        if (res['code'] === "success") {
            $('.activity#' + activity_id).find('span').html(activity_name);

            // Need to update both .data and .attr because jquery.data() does
            // not update DOM. So we do this just to be save.
            $('.activity#' + activity_id).data('color', activity_color);
            $('.activity#' + activity_id).attr('data-color', activity_color);

            closeOverlay();
        } else if (res['code'] == 'empty') {
            alert('Activity name cannot be empty.')
        } else if (res['code'] == 'duplicate') {
            alert('Activity name cannot be a duplicate.')
        } else {
            alert('Something went wrong on our side, sorry.')
        }
    });
});

/**
 * Deletes an activity. After the server says everything was successful removes
 * the activity from the client.
 */
$('.delete_activity').click(function () {
    var activity_id = $('.edit_activity_dialog').data('edited_activity_id');

    $.post('/api/delete-activity', { activity_id }, function (json) {
        if (JSON.parse(json) === "success") {
            $('.activity#' + activity_id).remove();

            closeOverlay();
        } else {
            alert('Something went wrong deleting your activity.');
        }
    });
});
