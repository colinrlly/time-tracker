import {
    SET_PREMIUM_SUBSCRIPTION,
} from '../../actions';

function premiumSubscriptionReducer(state = 'none', action) {
    switch (action.type) {
        case SET_PREMIUM_SUBSCRIPTION:
            return action.premiumSubscription;

        default:
            return state;
    }
}

export default premiumSubscriptionReducer;
