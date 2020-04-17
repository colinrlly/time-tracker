import React from 'react';
import {
    render,
    fireEvent,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import {
    SET_ACTIVITY_DIALOG_DISPLAYED,
} from '../../../../../redux/actions';

import NewActivityBtnContainer from '../index.jsx';

const mockStore = configureStore([]);

describe('NewActivityBtnContainer', () => {
    function setUp() {
        const store = mockStore({});

        const { getByText } = render(
            <Provider store={store}>
                <NewActivityBtnContainer />
            </Provider>,
        );

        return {
            store,
            getByText,
        };
    }

    it('Dispatches the proper Redux actions when buttons are clicked.', (done) => {
        const {
            store,
            getByText,
        } = setUp();

        fireEvent.click(getByText('+'));

        const expectedActivityDialogDisplayedAction = JSON.stringify({
            type: SET_ACTIVITY_DIALOG_DISPLAYED,
            activityDialogDisplayed: true,
        });

        setTimeout(() => {
            const actions = store.getActions();

            // Convert actions to JSON because array.includes doens't work on objects
            const jsonActions = actions.map((x) => JSON.stringify(x));

            expect(jsonActions.includes(expectedActivityDialogDisplayedAction)).toBeTruthy();
            done();
        }, 1000);
    });
});
