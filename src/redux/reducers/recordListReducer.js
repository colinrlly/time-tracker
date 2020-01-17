import {
    ADD_ACTIVITY_RECORD,
} from '../actions/actions';

function recordsListReducer(state = [], action) {
    switch (action.type) {
        case ADD_ACTIVITY_RECORD:
            return [
                ...state,
                {
                    end: action.end,
                    start: action.start,
                    summary: action.summary,
                    colorId: action.colorId,
                },
            ];

        default:
            return state;
    }
}

export default recordsListReducer;
