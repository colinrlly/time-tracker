import {
    SET_ACTIVITY_DIALOG_DISPLAYED,
    SET_NEW_ACTIVITY_NAME,
    SET_NEW_ACTIVITY_COLOR,
    SET_EDIT_ACTIVITY_NAME,
    SET_EDIT_ACTIVITY_COLOR,
    SET_EDIT_ACTIVITY_ID,
    SET_NEW_OR_EDIT_DIALOG,
} from '../../actions';

const INITIAL_STATE = {
    displayed: false,
    newOrEditDialog: 'new',
    newActivityName: '',
    newActivityColor: 1,
    editActivityName: '',
    editActivityColor: 1,
    editActivityId: -1,
};

function activityDialogReducer(state = INITIAL_STATE, action) {
    const newState = JSON.parse(JSON.stringify(state));

    switch (action.type) {
        case SET_ACTIVITY_DIALOG_DISPLAYED:
            newState.displayed = action.activityDialogDisplayed;

            return newState;

        case SET_NEW_ACTIVITY_NAME:
            newState.newActivityName = action.name;

            return newState;

        case SET_NEW_ACTIVITY_COLOR:
            newState.newActivityColor = action.color;

            return newState;

        case SET_EDIT_ACTIVITY_NAME:
            newState.editActivityName = action.name;

            return newState;

        case SET_EDIT_ACTIVITY_COLOR:
            newState.editActivityColor = action.color;

            return newState;

        case SET_EDIT_ACTIVITY_ID:
            newState.editActivityId = action.id;

            return newState;

        case SET_NEW_OR_EDIT_DIALOG:
            newState.newOrEditDialog = action.newOrEdit;

            return newState;

        default:
            return state;
    }
}

export default activityDialogReducer;
