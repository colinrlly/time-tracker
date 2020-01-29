import {
    SET_AGG_TOTALS,
} from '../actions/actions';

const initialState = {
    totals: [],
};

function aggregationsReducer(state = initialState, action) {
    const newState = {};

    switch (action.type) {
        case SET_AGG_TOTALS:
            newState.totals = action.totals;

            return newState;

        default:
            return state;
    }
}

export default aggregationsReducer;
