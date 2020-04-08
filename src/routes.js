import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store/store';
import Data from './scenes/data';
import Timer from './scenes/timer';

export default (
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={Timer} />
                <Route path='/data' component={Data} />
            </Switch>
        </BrowserRouter>
    </Provider>
);
