export const SET_RANGE = 'SET_RANGE';
export const SET_ACTIVITY_RECORDS = 'SET_ACTIVITY_RECORDS';
export const SET_ACTIVITY_NAMES = 'SET_ACTIVITY_NAMES';
export const SET_AGG_TOTALS = 'SET_AGG_TOTALS';
export const SET_AGG_FILTERED_TOTALS = 'SET_AGG_FILTERED_TOTALS';
export const SET_AGG_TOTAL_TIME = 'SET_AGG_TOTAL_TIME';
export const SET_AGG_STACKED_TOTALS = 'SET_AGG_STACKED_TOTALS';
export const UPDATE_LIST = 'UPDATE_LIST';

export function setRange(startDateTime, endDateTime) {
    return {
        type: SET_RANGE,
        startDateTime,
        endDateTime,
    };
}

export function setActivityRecords(records) {
    return { type: SET_ACTIVITY_RECORDS, records };
}

export function setActivityNames(names) {
    return { type: SET_ACTIVITY_NAMES, names };
}

export function setAggTotals(totals) {
    return { type: SET_AGG_TOTALS, totals };
}

export function setAggFilteredTotals(filteredTotals) {
    return { type: SET_AGG_FILTERED_TOTALS, filteredTotals };
}

export function setAggTotalTime(totalTime) {
    return { type: SET_AGG_TOTAL_TIME, totalTime };
}

export function setAggStackedTotals(stackedTotals) {
    return { type: SET_AGG_STACKED_TOTALS, stackedTotals };
}

export function updateList() {
    return { type: UPDATE_LIST };
}
