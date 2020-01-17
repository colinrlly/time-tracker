export const SET_RANGE = 'SET_RANGE';
export const ADD_ACTIVITY_RECORD = 'ADD_ACTIVITY_RECORD';

export function setRange(startOfRange, endOfRange) {
    return {
        type: SET_RANGE,
        startOfRange: startOfRange,
        endOfRange: endOfRange,
    };
}

export function addActivityRecord(record) {
    return { type: ADD_ACTIVITY_RECORD, record: record };
}
