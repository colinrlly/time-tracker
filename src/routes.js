import React from 'react';
import { HashRouter, Route, hashHistory } from 'react-router-dom';
import Home from '../static/js/front_end_framework/components/Home';
// import more components
export default (
    <HashRouter history={hashHistory}>
        <div>
            <Route path='/' component={Home} />
        </div>
    </HashRouter>
);