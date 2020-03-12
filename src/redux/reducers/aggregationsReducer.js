import {
    SET_AGG_TOTALS,
    SET_AGG_TOTAL_TIME,
} from '../actions/actions';

const initialState = {
    totals: [],
    totalTime: 0,
};

function aggregationsReducer(state = initialState, action) {
    const newState = {};

    switch (action.type) {
        case SET_AGG_TOTALS:
            newState.totals = action.totals;
            newState.totalTime = state.totalTime;

            return newState;

        case SET_AGG_TOTAL_TIME:
            newState.totalTime = action.totalTime;
            newState.totals = state.totals;

            return newState;
        default:
            return state;
    }
}

export default aggregationsReducer;
