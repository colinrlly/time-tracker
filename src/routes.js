import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import store from './redux/store/store';
import Data from './scenes/data';
import Timer from './scenes/timer';
import Landing from './scenes/landing';
import PremiumLanding from './scenes/premiumLanding';
import { Socket } from './components';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_Dt7r6xru8VEdvmTAkELr3zGg00XLII0yUP');

export default (
    <Elements stripe={stripePromise}>
        <Provider store={store}>
            <Socket />
            <BrowserRouter>
                <Switch>
                    <Route exact path='/' component={Timer} />
                    <Route path='/data' component={Data} />
                    <Route path='/landing' component={Landing} />
                    <Route path='/premium' component={PremiumLanding} />
                </Switch>
            </BrowserRouter>
        </Provider>
    </Elements>
);
