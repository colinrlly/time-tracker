import {
    ADD_ACTIVITY_RECORD,
} from '../actions/actions';

function recordsListReducer(list = [], action) {
    switch (action.type) {
        case ADD_ACTIVITY_RECORD:
            return [
                ...list,
                {
                    end: action.end,
                    start: action.start,
                    summary: action.summary,
                    colorId: action.colorId
                }
            ]

        default:
            return list;
    };
}

export default recordsListReducer;
