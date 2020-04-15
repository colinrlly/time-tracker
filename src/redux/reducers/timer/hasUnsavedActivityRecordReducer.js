import {
    SET_HAS_UNSAVED_ACTIVITY_RECORD,
} from '../../actions/timerActions';

function hasUnsavedActivityRecordReducer(state = false, action) {
    switch (action.type) {
        case SET_HAS_UNSAVED_ACTIVITY_RECORD:
            return action.hasUnsavedActivityRecord;

        default:
            return state;
    }
}

export default hasUnsavedActivityRecordReducer;
