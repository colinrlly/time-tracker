import {
    SET_ACTIVITY_RECORDS,
    UPDATE_LIST,
} from '../../actions';

const initialState = {
    list: [],
    numberUpdates: 0,
};

/**
 * Adds an activity record to the redux store.
 *
 * @param {Object} state - Previous state.
 * @param {Object} action - Redux action, here holding an activity record belonging to a user.
 */
function recordsListReducer(state = initialState, action) {
    const newState = {};

    switch (action.type) {
        case SET_ACTIVITY_RECORDS:
            newState.list = action.records;
            newState.numberUpdates = state.numberUpdates;
            return newState;

        case UPDATE_LIST:
            newState.list = state.list;
            newState.numberUpdates = state.numberUpdates + 1;
            return newState;

        default:
            return state;
    }
}

export default recordsListReducer;
