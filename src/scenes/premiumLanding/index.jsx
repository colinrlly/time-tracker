import React from 'react';
import {
    useStripe,
} from '@stripe/react-stripe-js';

const STRIPE_PREMIUM_PRICE_ID = 'price_1IGvSCLWafTZTzjvegopKTzn';

function PremiumLanding() {
    const stripe = useStripe();

    function createCheckoutSession(priceId) {
        return fetch('/create-checkout-session', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                priceId,
            }),
        }).then((result) => result.json());
    }

    return (
        <button
            onClick={() => {
                createCheckoutSession(STRIPE_PREMIUM_PRICE_ID).then((data) => {
                    console.log(data.sessionId);

                    stripe.redirectToCheckout({
                        sessionId: data.sessionId,
                    }).then((result) => console.log(result));
                });
            }}
        >Subscribe</button>
    );
}

export default PremiumLanding;
