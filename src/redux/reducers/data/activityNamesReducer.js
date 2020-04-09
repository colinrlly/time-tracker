import {
    SET_ACTIVITY_NAMES,
} from '../../actions';

/**
 * Sets the activity names list.
 *
 * @param {Object} state - Previous state.
 * @param {Object} action - Redux action, here holding an activity name belonging to a user.
 */
function ActivityNamesReducer(state = {}, action) {
    switch (action.type) {
        case SET_ACTIVITY_NAMES:
            return action.names;

        default:
            return state;
    }
}

export default ActivityNamesReducer;
