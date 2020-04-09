import {
    SET_ACTIVITY_RECORDS,
} from '../../actions/dataActions';

/**
 * Adds an activity record to the redux store.
 *
 * @param {Object} state - Previous state.
 * @param {Object} action - Redux action, here holding an activity record belonging to a user.
 */
function recordsListReducer(state = [], action) {
    switch (action.type) {
        case SET_ACTIVITY_RECORDS:
            return action.records;

        default:
            return state;
    }
}

export default recordsListReducer;
