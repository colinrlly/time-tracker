import {
    SET_USER_EMAIL,
} from '../../actions';

function userEmailReducer(state = '', action) {
    switch (action.type) {
        case SET_USER_EMAIL:
            return action.email;

        default:
            return state;
    }
}

export default userEmailReducer;
