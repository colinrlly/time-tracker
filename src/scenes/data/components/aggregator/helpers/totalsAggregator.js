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
        if (aggEvents[event].duration !== 0) { // Get rid of events with 0 duration (all-day)
            aggregatedEventsArray.push({
                name: event,
                duration: (parseInt(aggEvents[event].duration, 10) / 60),
                colorId: aggEvents[event].colorId,
                inActivities: aggEvents[event].inActivities,
            });
        }
    });

    // Sort the array so the events show up in order of increasing duration.
    aggregatedEventsArray.sort((a, b) => b.duration - a.duration);

    return aggregatedEventsArray;
}

export default totalsAggregator;
