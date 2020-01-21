import {
    ADD_ACTIVITY_RECORD,
} from '../actions/actions';

/**
 * Adds an activity record to the redux store.
 *
 * @param {Object} state - Previous state.
 * @param {Object} action - Redux action, here holding an activity record belonging to a user.
 */
function recordsListReducer(state = [], action) {
    switch (action.type) {
        case ADD_ACTIVITY_RECORD:
            return [
                ...state,
                {
                    end: action.record.end.dateTime,
                    start: action.record.start.dateTime,
                    summary: action.record.summary,
                    colorId: action.record.colorId,
                }];

        default:
            return state;
    }
}

export default recordsListReducer;
