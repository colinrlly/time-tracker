import {
    ADD_ACTIVITY_RECORD,
} from '../actions/actions';

function recordsListReducer(state = [], action) {
    switch (action.type) {
        case ADD_ACTIVITY_RECORD:
            return [
                ...state,
                {
                    end: action.record.end.dateTime,
                    start: action.record.start.dateTime,
                    summary: action.record.summary,
                    colorId: action.record.colorId,
                }];

        default:
            return state;
    }
}

export default recordsListReducer;
