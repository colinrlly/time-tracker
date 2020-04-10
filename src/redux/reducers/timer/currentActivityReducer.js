import {
    SET_CURRENT_ACTIVITY,
} from '../../actions/timerActions';

function currentActivityReducer(state = {}, action) {
    switch (action.type) {
        case SET_CURRENT_ACTIVITY:
            return action.currentActivity;

        default:
            return state;
    }
}

export default currentActivityReducer;
