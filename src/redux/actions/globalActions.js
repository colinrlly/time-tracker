export const SET_PREMIUM_SUBSCRIPTION = 'SET_PREMIUM_SUBSCRIPTION';
export const SET_USER_EMAIL = 'SET_USER_EMAIL';
export const FETCH_PREMIUM_SUBSCRIPTION = 'FETCH_PREMIUM_SUBSCRIPTION';

export function setPremiumSubscription(premiumSubscription) {
    return { type: SET_PREMIUM_SUBSCRIPTION, premiumSubscription };
}

export function setUserEmail(email) {
    return { type: SET_USER_EMAIL, email };
}

export function fetchStartupPayload() {
    return (dispatch) => fetch('/api/startup-payload', {
        method: 'get',
    })
        .then((res) => res.json())
        .then((data) => {
            dispatch(setPremiumSubscription(data.premium_subscription));
            dispatch(setUserEmail(data.email));
        });
}
