import React from 'react';
import ReactDOM from 'react-dom';
import routes from './routes';

const rootElement = document.getElementById('content');
ReactDOM.render(
    routes,
    rootElement,
);

// ServiceWorker is a progressive technology. Ignore unsupported browsers
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(() => { }, () => {
        console.log('CLIENT: service worker registration failure.');
    });
} else {
    console.log('CLIENT: service worker is not supported.');
}
