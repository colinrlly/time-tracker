import {
    SET_ALL_ACTIVITIES_LIST,
} from '../../actions/timerActions';

function allActivitiesListReduces(state = [], action) {
    switch (action.type) {
        case SET_ALL_ACTIVITIES_LIST:
            return action.activities;

        default:
            return state;
    }
}

export default allActivitiesListReduces;
