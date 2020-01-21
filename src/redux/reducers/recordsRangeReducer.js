import moment from 'moment';
import {
    SET_RANGE,
} from '../actions/actions';

// We initialize the range as the last 7 days.
const initialState = {
    startDateTime: moment().subtract(6, 'days').startOf('day'),
    endDateTime: moment().endOf('day'),
};

/**
 * Updates the range which specifies which activity records should be displayed.
 *
 * @param {Object} state - Previous state.
 * @param {Object} action - Redux action, here specifying a new range.
 */
function recordsRangeReducer(state = initialState, action) {
    switch (action.type) {
        case SET_RANGE:
            return {
                startDateTime: action.startDateTime,
                endDateTime: action.endDateTime,
            };

        default:
            return state;
    }
}

export default recordsRangeReducer;
