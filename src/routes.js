import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store/store';
import Data from './scenes/data';
import Timer from './scenes/timer';
import Landing from './scenes/landing';
import PremiumLanding from './scenes/premiumLanding';
import { Socket } from './components';

export default (
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
);
