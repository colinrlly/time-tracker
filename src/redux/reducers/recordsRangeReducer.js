import moment from 'moment';
import {
    SET_RANGE,
} from '../actions/actions';

const initialState = {
    startDateTime: moment().subtract(6, 'days'),
    endDateTime: moment(),
};

function recordsRangeReducer(state = initialState, action) {
    switch (action.type) {
        case SET_RANGE:
            return {
                startDateTime: action.startDateTime,
                endDateTime: action.endDateTime,
            };

        default:
            return state;
    }
}

export default recordsRangeReducer;
