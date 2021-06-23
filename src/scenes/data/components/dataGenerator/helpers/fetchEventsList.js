import moment from 'moment';
import axios from 'axios';

// Returns the minutes in a day for a moment object.
function minutesOfDay(m) {
    return m.minutes() + m.hours() * 60;
}

// Filter events by time range
function timeRangeFilter(startTime, endTime, events) {
    const indexesToRemove = [];

    const eventsCpy = JSON.parse(JSON.stringify(events));

    for (let i = 0; i < eventsCpy.length; i += 1) {
        // Convert event times to moment objects
        eventsCpy[i].start.moment = moment(eventsCpy[i].start.dateTime);
        eventsCpy[i].end.moment = moment(eventsCpy[i].end.dateTime);

        // Remove Google dateTimes from event objects
        delete eventsCpy[i].start.dateTime;
        delete eventsCpy[i].start.timeZone;
        delete eventsCpy[i].end.dateTime;
        delete eventsCpy[i].end.timeZone;

        const esm = minutesOfDay(eventsCpy[i].start.moment); // event start minutes
        const eem = minutesOfDay(eventsCpy[i].end.moment); // event end minutes
        const sm = minutesOfDay(startTime); // start time minutes
        const em = minutesOfDay(endTime); // end time minutes

        if (esm < sm && eem < sm) { // Both before time range
            // Remove event from list
            indexesToRemove.unshift(i);
        } else if (esm < sm && eem > sm && eem < em) { // Start before time range, end in time range
            // Change start time to time range start
            eventsCpy[i].start.moment.hours(startTime.hours());
            eventsCpy[i].start.moment.minutes(startTime.minutes());
        } else if (esm < sm && eem > em) { // Start before time range, end after time range
            // Change start time to time range start
            eventsCpy[i].start.moment.hours(startTime.hours());
            eventsCpy[i].start.moment.minutes(startTime.minutes());

            // Change end time to time range end
            eventsCpy[i].end.moment.hours(endTime.hours());
            eventsCpy[i].end.moment.minutes(endTime.minutes());
        } else if (esm > sm && esm < em && eem > em) { // Start in time range, end after time range
            // Chang end time to time range end
            eventsCpy[i].end.moment.hours(endTime.hours());
            eventsCpy[i].end.moment.minutes(endTime.minutes());
        } else if (esm > em && eem > em) { // Both after time range
            // Remove event from list
            indexesToRemove.unshift(i);
        } else if (esm > sm && esm < em && eem > sm && eem < em) { // Both in time range
            // Everything is gucci
        }
    }

    // We pushed the indexes to remove onto the front of this array so when we
    // remove them the order of the array doesn't get messed up.
    for (let i = 0; i < indexesToRemove.length; i += 1) {
        eventsCpy.splice(indexesToRemove[i], 1);
    }

    return eventsCpy;
}

function fetchEventsList(startDateTime, endDateTime) {
    return axios.post('/api/list_events', {
        startDateTime: startDateTime.format(),
        endDateTime: endDateTime.format(),
    }).then((response) => {
        const filteredByTime = timeRangeFilter(
            startDateTime,
            endDateTime,
            response.data.list,
        );

        const filteredByTimeAndAllDay = filteredByTime.filter((x) => !x.start.date);

        return filteredByTimeAndAllDay;
    }).catch((error) => {
        console.log(error);
    });
}

export default fetchEventsList;
