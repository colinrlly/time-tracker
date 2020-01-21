export const SET_RANGE = 'SET_RANGE';
export const ADD_ACTIVITY_RECORD = 'ADD_ACTIVITY_RECORD';

export function setRange(startDateTime, endDateTime) {
    return {
        type: SET_RANGE,
        startDateTime,
        endDateTime,
    };
}

export function addActivityRecord(record) {
    return { type: ADD_ACTIVITY_RECORD, record };
}
