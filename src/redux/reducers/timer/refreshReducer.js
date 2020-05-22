import {
    SET_IS_REFRESHING,
} from '../../actions';

const INITIAL_STATE = {
    isRefreshing: false,
};

function refreshReducer(state = INITIAL_STATE, action) {
    const newState = JSON.parse(JSON.stringify(state));

    switch (action.type) {
        case SET_IS_REFRESHING:
            newState.isRefreshing = action.isRefreshing;

            return newState;

        default:
            return state;
    }
}

export default refreshReducer;
