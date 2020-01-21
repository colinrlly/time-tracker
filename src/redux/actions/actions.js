export const SET_RANGE = 'SET_RANGE';
export const ADD_ACTIVITY_RECORD = 'ADD_ACTIVITY_RECORD';

/**
 * Updates the range specifying which activity records to request from the server.
 *
 * @param {Moment Object} startDateTime - Start of the range to get a user's activity records for. 
 * @param {Moment Object} endDateTime - End of the range to get a user's activity records for.
 */
export function setRange(startDateTime, endDateTime) {
    return {
        type: SET_RANGE,
        startDateTime,
        endDateTime,
    };
}

/**
 * Adds a user's activity record which is usually recieved from the server.
 *
 * @param {Object} record - An activity record from the server.
 */
export function addActivityRecord(record) {
    return { type: ADD_ACTIVITY_RECORD, record };
}
