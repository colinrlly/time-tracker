import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import store from './redux/store/store';
import Data from './scenes/data';
import Timer from './scenes/timer';
import Landing from './scenes/landing';
import Account from './scenes/account';
import PremiumLanding from './scenes/premiumLanding';
import PremiumSuccess from './scenes/premiumSuccess';

import { Socket } from './components';
import {
    fetchStartupPayload,
} from './redux/actions/globalActions';

const stripePromise = loadStripe('pk_test_Dt7r6xru8VEdvmTAkELr3zGg00XLII0yUP');

store.dispatch(fetchStartupPayload());

export default (
    <Elements stripe={stripePromise}>
        <Provider store={store}>
            <Socket />
            <BrowserRouter>
                <Switch>
                    <Route exact path='/' component={Timer} />
                    <Route path='/data' component={Data} />
                    <Route path='/landing' component={Landing} />
                    <Route path='/account' component={Account} />
                    <Route path='/premium/success' component={PremiumSuccess} />
                    <Route path='/premium' component={PremiumLanding} />
                </Switch>
            </BrowserRouter>
        </Provider>
    </Elements>
);
