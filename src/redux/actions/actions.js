export const SET_RANGE = 'SET_RANGE';
export const SET_ACTIVITY_RECORDS = 'SET_ACTIVITY_RECORDS';
export const SET_ACTIVITY_NAMES = 'SET_ACTIVITY_NAMES';
export const SET_AGG_TOTALS = 'SET_AGG_TOTALS';
export const SET_AGG_TOTAL_TIME = 'SET_AGG_TOTAL_TIME';

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
export function setActivityRecords(records) {
    return { type: SET_ACTIVITY_RECORDS, records };
}

export function setActivityNames(names) {
    return { type: SET_ACTIVITY_NAMES, names };
}

export function setAggTotals(totals) {
    return { type: SET_AGG_TOTALS, totals };
}

export function setAggTotalTime(totalTime) {
    return { type: SET_AGG_TOTAL_TIME, totalTime };
}
