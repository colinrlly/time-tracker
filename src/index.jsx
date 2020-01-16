import React from 'react';
import ReactDOM from 'react-dom';
import routes from "./routes";

const rootElement = document.getElementById('content');
ReactDOM.render(
    routes,
    rootElement
);
