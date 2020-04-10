export const SET_ALL_ACTIVITIES_LIST = 'SET_ALL_ACTIVITIES_LIST';
export const SET_CURRENT_ACTIVITY = 'SET_CURRENT_ACTIVITY';
export const SET_ACTIVITY_IS_RUNNING = 'SET_ACTIVITY_IS_RUNNING';
export const SET_LAST_ACTIVITY_START_TIME = 'SET_LAST_ACTIVITY_START_TIME';

export function setAllActivitiesList(activities) {
    return { type: SET_ALL_ACTIVITIES_LIST, activities };
}

export function setCurrentActivity(currentActivity) {
    return { type: SET_CURRENT_ACTIVITY, currentActivity };
}

export function setActivityIsRunning(activityIsRunning) {
    return { type: SET_ACTIVITY_IS_RUNNING, activityIsRunning };
}

export function setLastActivityStartTime(lastActivityStartTime) {
    return { type: SET_LAST_ACTIVITY_START_TIME, lastActivityStartTime };
}
