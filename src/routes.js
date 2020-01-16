import React from 'react';
import { HashRouter, Route, hashHistory } from 'react-router-dom';
import Data from './scenes/data/index';
import { Provider } from 'react-redux';
import store from './redux/store/store';

export default (
    <Provider store={store}>
        <HashRouter history={hashHistory}>
            <div>
                <Route path='/' component={Data} />
            </div>
        </HashRouter>
    </Provider>
);
