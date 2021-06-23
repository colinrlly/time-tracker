function getDurations(events) {
    return events.map((x) => {
        const end = x.end.moment;
        const start = x.start.moment;

        return {
            name: x.summary,
            duration: end.diff(start, 'minutes'),
            colorId: x.colorId,
            inActivities: x.inActivities,
        };
    });
}

// Aggregates and formats a list of activity records.
function totalsAggregator(eventsWithDuration) {
    // the events together grouped by name.
    const aggEvents = eventsWithDuration.reduce((acc, curr) => {
        const currentName = curr.name;

        if (!acc[currentName]) {
            acc[currentName] = {
                duration: 0,
                colorId: curr.colorId,
                inActivities: curr.inActivities,
            };
        }

        acc[currentName].duration += curr.duration;

        return acc;
    }, {});

    // Turn the dictionary of aggregated events into an array.
    const aggregatedEventsArray = [];

    Object.keys(aggEvents).forEach((event) => {
        aggregatedEventsArray.push({
            name: event,
            duration: (parseInt(aggEvents[event].duration, 10) / 60),
            colorId: aggEvents[event].colorId,
            inActivities: aggEvents[event].inActivities,
        });
    });

    // Sort the array so the events show up in order of increasing duration.
    aggregatedEventsArray.sort((a, b) => b.duration - a.duration);

    return aggregatedEventsArray;
}

function generateTotals(eventsList) {
    const eventsWithDuration = getDurations(eventsList);

    return totalsAggregator(eventsWithDuration);
}

export default generateTotals;
