import {
    SET_ACTIVITY_DIALOG_DISPLAYED,
    SET_NEW_ACTIVITY_NAME,
} from '../../actions';

const INITIAL_STATE = {
    displayed: false,
    newActivityName: '',
};

function activityDialogReducer(state = INITIAL_STATE, action) {
    const newState = JSON.parse(JSON.stringify(state));

    switch (action.type) {
        case SET_ACTIVITY_DIALOG_DISPLAYED:
            newState.displayed = action.activityDialogDisplayed;

            return newState;

        case SET_NEW_ACTIVITY_NAME:
            newState.newActivityName = action.newActivityName;

            return newState;

        default:
            return state;
    }
}

export default activityDialogReducer;
