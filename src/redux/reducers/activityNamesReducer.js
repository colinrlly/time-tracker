import {
    SET_ACTIVITY_NAMES,
} from '../actions/actions';

/**
 * Adds an activity name to the redux store.
 *
 * @param {Object} state - Previous state.
 * @param {Object} action - Redux action, here holding an activity name belonging to a user.
 */
function ActivityNamesReducer(state = [], action) {
    switch (action.type) {
        case SET_ACTIVITY_NAMES:
            return action.names;

        default:
            return state;
    }
}

export default ActivityNamesReducer;
