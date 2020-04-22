import React from 'react';
import {
    render,
    waitFor,
    fireEvent,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import axios from 'axios';
import MutationObserver from 'mutation-observer';

import {
    SET_CURRENT_ACTIVITY,
    SET_ACTIVITY_IS_RUNNING,
    SET_LAST_ACTIVITY_START_TIME,
    SET_ACTIVITY_DIALOG_DISPLAYED,
    SET_NEW_OR_EDIT_DIALOG,
    SET_EDIT_ACTIVITY_NAME,
    SET_EDIT_ACTIVITY_COLOR,
    SET_EDIT_ACTIVITY_ID,
} from '../../../../../redux/actions';

import ActivityListContainer from '../index.jsx';

const mockStore = configureStore([]);
jest.mock('axios');
global.MutationObserver = MutationObserver;

describe('ActivityListContainer', () => {
    const allActivitiesList = [
        {
            id: 54,
            name: 'Log',
            color: 10,
        },
        {
            id: 10,
            name: 'Games',
            color: 2,
        },
    ];

    function setUpActivityIsRunningFalse() {
        const store = mockStore({
            activityIsRunning: false,
            hasUnsavedActivityRecord: false,
            allActivitiesList,
            activityDialog:
                { displayed: false },
        });

        const { getByText, getByTestId } = render(
            <Provider store={store}>
                <ActivityListContainer />
            </Provider>,
        );

        return {
            allActivitiesList,
            store,
            getByText,
            getByTestId,
        };
    }

    it('Disables clicking when activityDialog is shown.', () => {
        const store = mockStore({
            activityIsRunning: false,
            hasUnsavedActivityRecord: false,
            allActivitiesList,
            activityDialog:
                { displayed: true },
        });

        const { getByText } = render(
            <Provider store={store}>
                <ActivityListContainer />
            </Provider>,
        );

        axios.post.mockImplementationOnce(() => Promise.resolve({ data: { code: 'success' } }));

        fireEvent.click(getByText('Log'));

        expect(axios.post).not.toHaveBeenCalled();
    });

    it('Tells the API to start an activity on activity click.', () => {
        const {
            getByText,
        } = setUpActivityIsRunningFalse();

        axios.post.mockImplementationOnce(() => Promise.resolve({ data: { code: 'success' } }));

        fireEvent.click(getByText('Log'));

        expect(axios.post.mock.calls[0][0]).toBe('api/start-activity');
        expect(axios.post.mock.calls[0][1]).toStrictEqual({ activity_id: 54 });
    });

    it('Dispatches proper Redux actions on activity click.', async () => {
        const {
            store,
            getByText,
        } = setUpActivityIsRunningFalse();

        axios.post.mockImplementationOnce(() => Promise.resolve({ data: { code: 'success' } }));

        fireEvent.click(getByText('Log'));

        await waitFor(() => expect(store.getActions()).not.toHaveLength(0));

        const expectedCurrentActivityAction = JSON.stringify({
            type: SET_CURRENT_ACTIVITY,
            currentActivity: allActivitiesList[0],
        });
        const expectedActivityIsRunning = JSON.stringify({
            type: SET_ACTIVITY_IS_RUNNING,
            activityIsRunning: true,
        });

        const expectedLastActivityStartTimeAction = SET_LAST_ACTIVITY_START_TIME;

        const actions = store.getActions();

        // Convert actions to JSON because array.includes doens't work on objects
        const jsonActions = actions.map((x) => JSON.stringify(x));

        // Test for just the lastActivityStartTime type because we won't be able
        // to match the moment object exactly.
        const justTypes = actions.map((x) => x.type);

        expect(jsonActions.includes(expectedCurrentActivityAction)).toBeTruthy();
        expect(jsonActions.includes(expectedActivityIsRunning)).toBeTruthy();
        expect(justTypes.includes(expectedLastActivityStartTimeAction)).toBeTruthy();
    });

    it('Renders activity list with proper activities from Redux.', () => {
        const {
            getByText,
        } = setUpActivityIsRunningFalse();

        expect(getByText(allActivitiesList[0].name)).toBeTruthy();
        expect(getByText(allActivitiesList[1].name)).toBeTruthy();
    });

    it('Doesn\'t render anything if activityIsRunning is true.', () => {
        const store = mockStore({
            activityIsRunning: true,
            hasUnsavedActivityRecord: false,
            allActivitiesList,
            activityDialog:
                { displayed: false },
        });

        const { queryByText } = render(
            <Provider store={store}>
                <ActivityListContainer />
            </Provider>,
        );

        expect(queryByText(allActivitiesList[0].name)).toBeNull();
    });

    it('Doesn\'t render anything if hasUnsavedActivityRecord is true.', () => {
        const store = mockStore({
            activityIsRunning: false,
            hasUnsavedActivityRecord: true,
            allActivitiesList,
            activityDialog:
                { displayed: false },
        });

        const { queryByText } = render(
            <Provider store={store}>
                <ActivityListContainer />
            </Provider>,
        );

        expect(queryByText(allActivitiesList[0].name)).toBeNull();
    });

    it('Dispatches the proper redux events when edit button is clicked.', async () => {
        const {
            getByTestId,
            store,
        } = setUpActivityIsRunningFalse();

        fireEvent.click(getByTestId('edit-Log'));

        await waitFor(() => expect(store.getActions()).not.toHaveLength(0));

        const expectedEditDisplayedAction = JSON.stringify({
            type: SET_ACTIVITY_DIALOG_DISPLAYED,
            activityDialogDisplayed: true,
        });
        const expectedEditOrNewAction = JSON.stringify({
            type: SET_NEW_OR_EDIT_DIALOG,
            newOrEdit: 'edit',
        });
        const expectedEditNameAction = JSON.stringify({
            type: SET_EDIT_ACTIVITY_NAME,
            name: 'Log',
        });
        const expectedEditColorAction = JSON.stringify({
            type: SET_EDIT_ACTIVITY_COLOR,
            color: 10,
        });
        const expectedEditIdAction = JSON.stringify({
            type: SET_EDIT_ACTIVITY_ID,
            id: 54,
        });

        const actions = store.getActions();

        // Convert actions to JSON because array.includes doens't work on objects
        const jsonActions = actions.map((x) => JSON.stringify(x));

        expect(jsonActions.includes(expectedEditDisplayedAction)).toBeTruthy();
        expect(jsonActions.includes(expectedEditOrNewAction)).toBeTruthy();
        expect(jsonActions.includes(expectedEditNameAction)).toBeTruthy();
        expect(jsonActions.includes(expectedEditColorAction)).toBeTruthy();
        expect(jsonActions.includes(expectedEditIdAction)).toBeTruthy();
    });
});
