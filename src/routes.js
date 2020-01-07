import React from 'react';
import { HashRouter, Route, hashHistory } from 'react-router-dom';
import Data from './scenes/data/index';
// import more components
export default (
    <HashRouter history={hashHistory}>
        <div>
            <Route path='/' component={Data} />
        </div>
    </HashRouter>
);
