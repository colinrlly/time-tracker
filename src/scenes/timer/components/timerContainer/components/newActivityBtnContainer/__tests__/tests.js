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
    SET_ACTIVITY_DIALOG_DISPLAYED, SET_NEW_OR_EDIT_DIALOG,
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

        const { getByText, getByTestId } = render(
            <Provider store={store}>
                <NewActivityBtnContainer />
            </Provider>,
        );

        return {
            store,
            getByText,
            getByTestId,
        };
    }

    it('Dispatches the proper Redux actions when button is clicked.', async () => {
        const {
            store,
            getByTestId,
        } = setUp();

        fireEvent.click(getByTestId('newActivityBtn'));

        const expectedActivityDialogDisplayedAction = JSON.stringify({
            type: SET_ACTIVITY_DIALOG_DISPLAYED,
            activityDialogDisplayed: true,
        });
        const expectedNewOrEditAction = JSON.stringify({
            type: SET_NEW_OR_EDIT_DIALOG,
            newOrEdit: 'new',
        });

        await waitFor(() => expect(store.getActions()).not.toHaveLength(0));

        const actions = store.getActions();

        // Convert actions to JSON because array.includes doens't work on objects
        const jsonActions = actions.map((x) => JSON.stringify(x));

        expect(jsonActions.includes(expectedActivityDialogDisplayedAction)).toBeTruthy();
        expect(jsonActions.includes(expectedNewOrEditAction)).toBeTruthy();
    });

    it('Doesn\'t show itself when acitivtyIsRunning is true.', () => {
        const store = mockStore({
            activityIsRunning: true,
            hasUnsavedActivityRecord: false,
            activityDialog: {
                displayed: false,
            },
        });

        const { queryByTestId } = render(
            <Provider store={store}>
                <NewActivityBtnContainer />
            </Provider>,
        );

        expect(queryByTestId('newActivityBtn')).toBeNull();
    });

    it('Doesn\'t show itself when hasUnsavedActivityRecord is true.', () => {
        const store = mockStore({
            activityIsRunning: false,
            hasUnsavedActivityRecord: true,
            activityDialog: {
                displayed: false,
            },
        });

        const { queryByTestId } = render(
            <Provider store={store}>
                <NewActivityBtnContainer />
            </Provider>,
        );

        expect(queryByTestId('newActivityBtn')).toBeNull();
    });
});
