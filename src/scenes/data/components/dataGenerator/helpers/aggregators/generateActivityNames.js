function generateActivityNames(list) {
    const activityNames = {};
    let newActivity = {};
    let name = '';

    for (let i = 0; i < list.length; i += 1) {
        name = list[i].name;

        newActivity = {
            inActivities: list[i].inActivities,
            colorId: list[i].colorId,
            selected: list[i].inActivities,
        };

        if (!(name in activityNames)) {
            activityNames[name] = newActivity;
        }
    }

    return activityNames;
}

export default generateActivityNames;
