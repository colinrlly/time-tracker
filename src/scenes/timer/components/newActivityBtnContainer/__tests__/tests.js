import React from 'react';
import {
    render,
    fireEvent,
    waitFor,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import MutationObserver from 'mutation-observer';

import {
    SET_ACTIVITY_DIALOG_DISPLAYED,
} from '../../../../../redux/actions';

import NewActivityBtnContainer from '../index.jsx';

const mockStore = configureStore([]);
global.MutationObserver = MutationObserver;

describe('NewActivityBtnContainer', () => {
    function setUp() {
        const store = mockStore({
            activityIsRunning: false,
            hasUnsavedActivityRecord: false,
            activityDialog: {
                displayed: false,
            },
        });

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

    it('Dispatches the proper Redux actions when buttons are clicked.', async () => {
        const {
            store,
            getByText,
        } = setUp();

        fireEvent.click(getByText('+'));

        const expectedActivityDialogDisplayedAction = JSON.stringify({
            type: SET_ACTIVITY_DIALOG_DISPLAYED,
            activityDialogDisplayed: true,
        });

        await waitFor(() => expect(store.getActions()).not.toHaveLength(0));

        const actions = store.getActions();

        // Convert actions to JSON because array.includes doens't work on objects
        const jsonActions = actions.map((x) => JSON.stringify(x));

        expect(jsonActions.includes(expectedActivityDialogDisplayedAction)).toBeTruthy();
    });

    it('Doesn\'t show itself when acitivtyIsRunning is true.', () => {
        const store = mockStore({
            activityIsRunning: true,
            hasUnsavedActivityRecord: false,
            activityDialog: {
                displayed: false,
            },
        });

        const { queryByText } = render(
            <Provider store={store}>
                <NewActivityBtnContainer />
            </Provider>,
        );

        expect(queryByText('+')).toBeNull();
    });

    it('Doesn\'t show itself when hasUnsavedActivityRecord is true.', () => {
        const store = mockStore({
            activityIsRunning: false,
            hasUnsavedActivityRecord: true,
            activityDialog: {
                displayed: false,
            },
        });

        const { queryByText } = render(
            <Provider store={store}>
                <NewActivityBtnContainer />
            </Provider>,
        );

        expect(queryByText('+')).toBeNull();
    });
});
