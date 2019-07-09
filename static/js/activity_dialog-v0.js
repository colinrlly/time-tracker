function closeOverlay() {
    $('.overlay').hide();
    $('div.blur').removeClass('frost');
    $('a.activity').prop("disabled", false);
    $('button.plus').prop("disabled", false);
    $('button.edit_activity_btn').prop("disabled", false);
}

$('button.plus').click(function (event) {
    /* show the add activity overlay */
    $('div.blur').addClass('frost');
    $('div.add_activity_dialog').show();
    $('a.activity').prop("disabled", true);
    $('button.edit_activity_btn').prop("disabled", true);
    $('button.plus').prop('disabled', true);

    event.stopPropagation();
});

$('button.add_activity_btn').click(function () {
    /* saves new activity, makes a button for it, and hides overlay */
    var name = $('.add_activity_dialog').find('input.activity_name').val();
    var color = $('.add_activity_dialog').find('button.selectedcolor').attr('name');

    $.post('/api/create-activity', { 'activity': name, 'color': color }, function (json) {
        data = JSON.parse(json);

        if (data['code'] == 'success') {
            $('div.butt').append(
                '<a class="activity" id="' + data['activity_id'] + '"data-color="' + color + '">'
                    + '<span>' + name + '</span>'
                    + '<button class="edit_activity_btn">'
                        + '<img src="../static/image/edit-icon.png">'
                    + '</button>'
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

// Get the modal
var add_activity_dialog = $('.add_activity_dialog');
var edit_activity_dialog = $('.edit_activity_dialog');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
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

$('button.color').click(function () {
    $('button.selectedcolor').removeClass('selectedcolor');
    $(this).addClass('selectedcolor');
});

$('button.close').click(function () {
    /* Closes add activity dialog. */
    closeOverlay();
});

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

$('.delete_activity').click(function () {
    var activity_id = $('.edit_activity_dialog').data('edited_activity_id');

    $.post('/api/delete-activity', { activity_id }, function (json) {
        if (JSON.parse(json) === "success") {
            $('.activity#' + activity_id).remove();

            closeOverlay();
        } else {
            alert('Something went wrong on our side, sorry.');
        }
    });
});
