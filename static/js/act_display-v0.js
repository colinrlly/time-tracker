/**
 * Shows current activity.
 */
var act_name = function(activity) {
    $('p.name').html(activity).show();
}

/**
 * Hides current activity.
 */
var act_hide = function(){
    $('p.name').html('').hide();
}