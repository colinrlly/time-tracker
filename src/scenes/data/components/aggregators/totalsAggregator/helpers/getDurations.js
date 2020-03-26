// Get the duration of each event.
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

export default getDurations;
