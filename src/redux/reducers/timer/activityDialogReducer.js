import {
    SET_ACTIVITY_DIALOG_DISPLAYED,
} from '../../actions';

const INITIAL_STATE = {
    displayed: false,
};

function activityDialogReducer(state = INITIAL_STATE, action) {
    const newState = {};

    switch (action.type) {
        case SET_ACTIVITY_DIALOG_DISPLAYED:
            newState.displayed = action.activityDialogDisplayed;

            return newState;

        default:
            return state;
    }
}

export default activityDialogReducer;
