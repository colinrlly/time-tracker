// Function to run when a custom date range is selected.
function setCustomRange() {
    $('.rangeTypeBtn').html('Custom');
    $('.rangeBackwardBtn').hide();
    $('.rangeForwardBtn').hide();
}

// Function to run when a custom date range is de-selected.
function removeCustomRange() {
    $('.rangeBackwardBtn').show();
    $('.rangeForwardBtn').show();
}

// Shows the range type dropdown.
$('.rangeTypeBtn').click(function () {
    $('.rangeTypeDropdownContent').show();
})

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.rangeTypeBtn')
        && $('.rangeTypeBtn').is(':visible')) {
        $('.rangeTypeDropdownContent').hide();
    }
}

// Handles when the user chooses a new date range type from the dropdown.
$('.rangeTypeDropdownContent button').click(function (event) {
    var selection = $(this).html();

    $('.rangeTypeBtn').html(selection);

    switch (selection) {
        case 'Day':
            setRange(getEndOfRange(), 1);
            $('input[name="daterange"]').data('rangeSize', 1);
            removeCustomRange();
            break;
        case 'Week':
            setRange(getEndOfRange(), 7);
            $('input[name="daterange"]').data('rangeSize', 7);
            removeCustomRange();
            break;
        case 'Month':
            setRange(getEndOfRange(), 30);
            $('input[name="daterange"]').data('rangeSize', 30);
            removeCustomRange();
            break;
        case '180 Days':
            setRange(getEndOfRange(), 180);
            $('input[name="daterange"]').data('rangeSize', 180);
            removeCustomRange();
            break;
        case 'Year':
            setRange(getEndOfRange(), 365);
            $('input[name="daterange"]').data('rangeSize', 365);
            removeCustomRange();
            break;
        // Not sure how to define all time yet.
        // case 'All Time':
        //     setRange(moment(), 0);
        //     break;
        default:
            alert('Invalid Time Range');
    }
})

// Executes the flow for a newly selected date range.
function setRange(endOfRange, rangeSize) {
    var startOfRange = moment(endOfRange).subtract(rangeSize, 'd');

    $('input[name="daterange"]').data('start', startOfRange);
    $('input[name="daterange"]').data('end', endOfRange);

    $('input[name="daterange"]').data('daterangepicker').setStartDate(startOfRange.format('MM/DD/YYYY'));
    $('input[name="daterange"]').data('daterangepicker').setEndDate(endOfRange.format('MM/DD/YYYY'));

    updateChart();
}

// Returns the start of the current date range.
function getStartOfRange() {
    return $('input[name="daterange"]').data('start');
}

// Returns the end of the current date range.
function getEndOfRange() {
    return $('input[name="daterange"]').data('end');
}

// Returns the size of the current date range i.e. week, month, etc.
function getRangeSize() {
    return $('input[name="daterange"]').data('rangeSize');
}

// Handles clicking the range backwards button.
$('.rangeBackwardBtn').click(function () {
    setRange(getStartOfRange(), getRangeSize());
})

// Handles clicking the range forwards button.
$('.rangeForwardBtn').click(function () {
    var rangeSize = getRangeSize();
    setRange(moment(getEndOfRange()).add(rangeSize, 'd'), rangeSize);
})
