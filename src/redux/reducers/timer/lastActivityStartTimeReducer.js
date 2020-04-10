import {
    SET_LAST_ACTIVITY_START_TIME,
} from '../../actions/timerActions';

function lastActivityStartTimeReducer(state = null, action) {
    switch (action.type) {
        case SET_LAST_ACTIVITY_START_TIME:
            return action.lastActivityStartTime;

        default:
            return state;
    }
}

export default lastActivityStartTimeReducer;
