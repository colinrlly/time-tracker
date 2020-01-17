export const CHANGE_RANGE_START = 'CHANGE_RANGE_START';
export const CHANGE_RANGE_END = 'CHANGE_RANGE_START';
export const ADD_ACTIVITY_RECORD = 'ADD_ACTIVITY_RECORD';

export function changeRangeStart(startOfRange) {
    return { type: CHANGE_RANGE_START, startOfRange: startOfRange };
}

export function changeRangeEnd(endOfRange) {
    return { type: CHANGE_RANGE_END, endOfRange: endOfRange };
}

export function addActivityRecord(record) {
    return record;
}
