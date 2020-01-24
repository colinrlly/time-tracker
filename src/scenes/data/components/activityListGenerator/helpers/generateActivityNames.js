function containsObject(obj, list) {
    let i;

    for (i = 0; i < list.length; i += 1) {
        if (list[i].name === obj.name) {
            return true;
        }
    }

    return false;
}

function generateActivityNames(list) {
    const activityNames = [];
    let newActivity = {};

    for (let i = 0; i < list.length; i += 1) {
        newActivity = {
            name: list[i].summary,
            inActivities: list[i].inActivities,
            colorId: list[i].colorId,
            selected: list[i].inActivities,
        };

        if (!containsObject(newActivity, activityNames)) {
            activityNames.push(newActivity);
        }
    }

    return activityNames;
}

export default generateActivityNames;
