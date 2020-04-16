import {
    SET_LAST_ACTIVITY_STOP_TIME,
} from '../../actions/timerActions';

function lastActivityStopTimeReducer(state = null, action) {
    switch (action.type) {
        case SET_LAST_ACTIVITY_STOP_TIME:
            return action.lastActivityStopTime;

        default:
            return state;
    }
}

export default lastActivityStopTimeReducer;
