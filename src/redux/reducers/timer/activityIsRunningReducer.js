import {
    SET_ACTIVITY_IS_RUNNING,
} from '../../actions/timerActions';

function activityIsRunningReducer(state = false, action) {
    switch (action.type) {
        case SET_ACTIVITY_IS_RUNNING:
            return action.activityIsRunning;

        default:
            return state;
    }
}

export default activityIsRunningReducer;
