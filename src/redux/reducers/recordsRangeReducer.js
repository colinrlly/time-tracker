import {
    SET_RANGE,
} from '../actions/actions';

const initialState = {
    startOfRange: '',
    endOfRange: '',
};

function recordsRangeReducer(state = initialState, action) {
    switch (action.type) {
        case SET_RANGE:
            return {
                startOfRange: action.startOfRange,
                endOfRange: action.endOfRange,
            };

        default:
            return state;
    }
}

export default recordsRangeReducer;
