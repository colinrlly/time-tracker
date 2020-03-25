import {
    SET_AGG_TOTALS,
    SET_AGG_FILTERED_TOTALS,
    SET_AGG_TOTAL_TIME,
} from '../actions/actions';

const initialState = {
    totals: [],
    filteredTotals: [],
    totalTime: 0,
};

function aggregationsReducer(state = initialState, action) {
    const newState = {};

    switch (action.type) {
        case SET_AGG_TOTALS:
            newState.totals = action.totals;
            newState.filteredTotals = state.filteredTotals;
            newState.totalTime = state.totalTime;

            return newState;

        case SET_AGG_FILTERED_TOTALS:
            newState.totals = state.totals;
            newState.filteredTotals = action.filteredTotals;
            newState.totalTime = state.totalTime;

            return newState;

        case SET_AGG_TOTAL_TIME:
            newState.totals = state.totals;
            newState.filteredTotals = state.filteredTotals;
            newState.totalTime = action.totalTime;

            return newState;
        default:
            return state;
    }
}

export default aggregationsReducer;
