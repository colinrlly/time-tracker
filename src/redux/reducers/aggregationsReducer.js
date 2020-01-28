import {
    SET_AGG_TOTALS,
} from '../actions/actions';

const initialState = {
    totals: [],
};

function aggregationsReducer(state = initialState, action) {
    const stateCpy = JSON.parse(JSON.stringify(state));

    switch (action.type) {
        case SET_AGG_TOTALS:
            stateCpy.totals = action.totals;

            return stateCpy;

        default:
            return state;
    }
}

export default aggregationsReducer;
