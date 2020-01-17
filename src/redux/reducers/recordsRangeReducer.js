import {
    CHANGE_RANGE_START,
    CHANGE_RANGE_END,
} from '../actions/actions';

const initialState = {
    startOfRange: '',
    endOfRange: ''
}

function recordsRangeReducer(range = initialState, action) {
    switch (action.type) {
        case CHANGE_RANGE_START:
            return {
                startOfRange: action.startOfRange,
                endOfRange: range.endOfRange
            }

        case CHANGE_RANGE_END:
            return {
                startOfRange: range.startOfRange,
                endOfRange: action.startOfRange
            }

        default:
            return range;
    };
}

export default recordsRangeReducer;
