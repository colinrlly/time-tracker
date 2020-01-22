import {
    ADD_ACTIVITY_NAME,
} from '../actions/actions';

/**
 * Adds an activity name to the redux store.
 *
 * @param {Object} state - Previous state.
 * @param {Object} action - Redux action, here holding an activity name belonging to a user.
 */
function ActivityNamesReducer(state = [], action) {
    switch (action.type) {
        case ADD_ACTIVITY_NAME:
            return [
                ...state,
                {
                    name: action.name.name,
                    inActivities: action.name.inActivities,
                    selected: action.name.selected,
                }];

        default:
            return state;
    }
}

export default ActivityNamesReducer;
