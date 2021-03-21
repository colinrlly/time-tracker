export const SET_PREMIUM_SUBSCRIPTION = 'SET_PREMIUM_SUBSCRIPTION';
export const FETCH_PREMIUM_SUBSCRIPTION = 'FETCH_PREMIUM_SUBSCRIPTION';

export function setPremiumSubscription(premiumSubscription) {
    return { type: SET_PREMIUM_SUBSCRIPTION, premiumSubscription };
}

export function fetchPremiumSubscription() {
    return (dispatch) => fetch('/api/premium_subscription', {
        method: 'get',
    })
        .then((res) => res.json())
        .then((data) => {
            dispatch(setPremiumSubscription(data.premium_subscription));
        });
}
