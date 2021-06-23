function generateFilteredTotals(totals, activityNames) {
    return (Object.keys(activityNames).length !== 0)
        ? totals.filter(
            (activity) => activityNames[activity.name].selected,
        ) : [];
}

export default generateFilteredTotals;
