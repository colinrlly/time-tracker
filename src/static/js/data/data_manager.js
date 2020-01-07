// Class to retrieve the data from the server and hold it

var date_ranges = [];
var data = null;

class Data_Manager {
    constructor() {
        this.start_of_range = getStartOfRange().toISOString();
        this.end_of_range = getEndOfRange().toISOString();

        this.data = [];

        this.date_range = [];

        this.get_data();
    }

    async get_data() {
        // Add the new date range to the date_ranges array.
        // This array is used to keep track of the last selected date range,
        // so if the data returns from the server out of order this array is used to
        // update using only the most recent date range.
        date_ranges.push({ 'start': getStartOfRange().toISOString(), 'end': getEndOfRange().toISOString() });


        // Ask the server for the events in a specified date range.
        await $.post('/api/list_events', {
            'startOfRange': getStartOfRange().toISOString(),
            'endOfRange': getEndOfRange().toISOString(),
        }, function (json) {
            var res = JSON.parse(json);

            this.data = res;

            console.log(this.data);
        })
    }
}
