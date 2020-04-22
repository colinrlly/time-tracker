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
    SET_ACTIVITY_DIALOG_DISPLAYED,
    SET_NEW_ACTIVITY_NAME,
    SET_NEW_ACTIVITY_COLOR,
    SET_ALL_ACTIVITIES_LIST,
    SET_EDIT_ACTIVITY_NAME,
    SET_EDIT_ACTIVITY_COLOR,
    SET_EDIT_ACTIVITY_ID,
} from '../../../../../redux/actions';

import ActivityDialogContainer from '../index.jsx';

const mockStore = configureStore([]);
jest.mock('axios');
window.alert = jest.fn();
global.MutationObserver = MutationObserver;

describe('ActivityDialogContainer', () => {
    function setUp() {
        const store = mockStore({
            activityDialog:
            {
                displayed: true,
                newActivityName: '',
                newActivityColor: 1,
                newOrEditDialog: 'new',
                editActivityName: 'Games',
                editActivityColor: 8,
                editActivityId: 61,
            },
        });

        const {
            getByText,
            container,
            getByLabelText,
            getByTestId,
        } = render(
            <Provider store={store}>
                <ActivityDialogContainer />
            </Provider>,
        );

        return {
            store,
            getByText,
            container,
            getByLabelText,
            getByTestId,
        };
    }

    afterEach(() => {
        axios.post.mockClear();
        window.alert.mockClear();
    });

    it('Dispatches the proper redux actions when a color button is pressed.', async () => {
        const {
            store,
            getByTestId,
        } = setUp();

        const colorBtn2 = getByTestId('colorBtn2');

        fireEvent.click(colorBtn2);

        await waitFor(() => expect(store.getActions()).not.toHaveLength(0));

        const expectedAction = JSON.stringify({
            type: SET_NEW_ACTIVITY_COLOR,
            color: 2,
        });

        const actions = store.getActions();

        // Convert actions to JSON because array.includes doesn't work on objects
        const jsonActions = actions.map((x) => JSON.stringify(x));

        expect(jsonActions.includes(expectedAction)).toBeTruthy();
    });

    it('Displays the proper newActivityName based on redux.', () => {
        const store = mockStore({
            activityDialog: {
                displayed: true,
                newActivityName: 'test name',
                newActivityColor: 1,
                newOrEditDialog: 'new',
                editActivityName: 'Games',
                editActivityColor: 8,
                editActivityId: 61,
            },
        });

        const { getByLabelText } = render(
            <Provider store={store}>
                <ActivityDialogContainer />
            </Provider>,
        );

        expect(getByLabelText('activity-name-input').value).toBe('test name');
    });

    it('Dispatches the proper redux events when the input is changed.', async () => {
        const {
            store,
            getByLabelText,
        } = setUp();

        const input = getByLabelText('activity-name-input');

        fireEvent.change(input, { target: { value: 'test name' } });

        await waitFor(() => expect(store.getActions()).not.toHaveLength(0));

        const expectedAction = JSON.stringify({
            type: SET_NEW_ACTIVITY_NAME,
            name: 'test name',
        });

        const actions = store.getActions();

        // Convert actions to JSON because array.includes doesn't work on objects
        const jsonActions = actions.map((x) => JSON.stringify(x));
        expect(jsonActions.includes(expectedAction)).toBeTruthy();
    });

    it('Dispatches the proper redux events when the exit button is clicked.', async () => {
        const {
            store,
            getByText,
        } = setUp();

        fireEvent.click(getByText('+'));

        await waitFor(() => expect(store.getActions()).not.toHaveLength(0));

        const expectedAction = JSON.stringify({
            type: SET_ACTIVITY_DIALOG_DISPLAYED,
            activityDialogDisplayed: false,
        });

        const actions = store.getActions();

        // Convert actions to JSON because array.includes doesn't work on objects
        const jsonActions = actions.map((x) => JSON.stringify(x));
        expect(jsonActions.includes(expectedAction)).toBeTruthy();
    });

    it('Displays itself when activityDialogDisplayed is true.', () => {
        const { container } = setUp();

        expect(container.firstChild).toBeTruthy();
    });

    it('Doesn\'t display itself when activityDialogDisplayed is false.', () => {
        const store = mockStore({
            activityDialog: {
                displayed: false,
                newActivityName: 'test name',
                newActivityColor: 1,
                newOrEditDialog: 'new',
                editActivityName: 'Games',
                editActivityColor: 8,
                editActivityId: 61,
            },
        });

        const { container } = render(
            <Provider store={store}>
                <ActivityDialogContainer />
            </Provider>,
        );

        expect(container.firstChild).toBeNull();
    });

    it('Hits the proper endpoints when the add button is pressed.', () => {
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

        const store = mockStore({
            allActivitiesList,
            activityDialog:
            {
                displayed: true,
                newActivityName: 'test',
                newActivityColor: 3,
                newOrEditDialog: 'new',
                editActivityName: 'Games',
                editActivityColor: 8,
                editActivityId: 61,
            },
        });

        const {
            getByText,
        } = render(
            <Provider store={store}>
                <ActivityDialogContainer />
            </Provider>,
        );

        axios.post.mockImplementationOnce(() => Promise.resolve({ data: { code: 'success', activity_id: 15 } }));

        fireEvent.click(getByText('Add'));

        expect(axios.post.mock.calls[0][0]).toBe('api/create-activity');
    });

    it('Dispatches the proper redux events when the add button is clicked.', async () => {
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

        const store = mockStore({
            allActivitiesList,
            activityDialog:
            {
                displayed: true,
                newActivityName: 'test',
                newActivityColor: 3,
                newOrEditDialog: 'new',
                editActivityName: 'Games',
                editActivityColor: 8,
                editActivityId: 61,
            },
        });

        const {
            getByText,
        } = render(
            <Provider store={store}>
                <ActivityDialogContainer />
            </Provider>,
        );

        axios.post.mockImplementationOnce(() => Promise.resolve({ data: { code: 'success', activity_id: 15 } }));

        fireEvent.click(getByText('Add'));

        await waitFor(() => expect(store.getActions()).not.toHaveLength(0));

        const expectedDisplayedAction = JSON.stringify({
            type: SET_ACTIVITY_DIALOG_DISPLAYED,
            activityDialogDisplayed: false,
        });
        const expectedActivitiesListAction = JSON.stringify({
            type: SET_ALL_ACTIVITIES_LIST,
            activities: [
                ...allActivitiesList,
                {
                    id: 15,
                    name: 'test',
                    color: 3,
                },
            ],
        });
        const expectedNameAction = JSON.stringify({
            type: SET_NEW_ACTIVITY_NAME,
            name: '',
        });
        const expectedColorAction = JSON.stringify({
            type: SET_NEW_ACTIVITY_COLOR,
            color: 1,
        });

        const actions = store.getActions();

        // Convert actions to JSON because array.includes doesn't work on objects
        const jsonActions = actions.map((x) => JSON.stringify(x));
        expect(jsonActions.includes(expectedDisplayedAction)).toBeTruthy();
        expect(jsonActions.includes(expectedActivitiesListAction)).toBeTruthy();
        expect(jsonActions.includes(expectedNameAction)).toBeTruthy();
        expect(jsonActions.includes(expectedColorAction)).toBeTruthy();
    });

    it('Alerts the user when the activity name is empty.', async () => {
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

        const store = mockStore({
            allActivitiesList,
            activityDialog:
            {
                displayed: true,
                newActivityName: '',
                newActivityColor: 10,
                newOrEditDialog: 'new',
                editActivityName: 'Games',
                editActivityColor: 8,
                editActivityId: 61,
            },
        });

        const {
            getByText,
        } = render(
            <Provider store={store}>
                <ActivityDialogContainer />
            </Provider>,
        );

        axios.post.mockImplementationOnce(() => Promise.resolve({ data: { code: 'empty' } }));

        fireEvent.click(getByText('Add'));

        await waitFor(
            () => expect(window.alert.mock.calls[0][0]).toBe(
                'New activity name cannot be empty.',
            ),
        );
    });

    it('Alerts the user when the activity name is a duplicate.', async () => {
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

        const store = mockStore({
            allActivitiesList,
            activityDialog: {
                displayed: true,
                newActivityName: 'Log',
                newActivityColor: 10,
                newOrEditDialog: 'new',
                editActivityName: 'Games',
                editActivityColor: 8,
                editActivityId: 61,
            },
        });

        const {
            getByText,
        } = render(
            <Provider store={store}>
                <ActivityDialogContainer />
            </Provider>,
        );

        axios.post.mockImplementationOnce(() => Promise.resolve({ data: { code: 'duplicate' } }));

        fireEvent.click(getByText('Add'));

        await waitFor(
            () => expect(window.alert.mock.calls[0][0]).toBe(
                'New activity name cannot be a duplicate.',
            ),
        );
    });

    it('Displays edit activity dialog acording to redux.', () => {
        const store = mockStore({
            activityDialog: {
                displayed: true,
                newOrEditDialog: 'edit',
                newActivityName: '',
                newActivityColor: 1,
                editActivityName: 'Games',
                editActivityColor: 8,
                editActivityId: 61,
            },
        });

        const { getByText } = render(
            <Provider store={store}>
                <ActivityDialogContainer />
            </Provider>,
        );

        expect(getByText('Save')).toBeTruthy();
    });

    it('Displays new activity dialog acording to redux.', () => {
        const store = mockStore({
            activityDialog: {
                displayed: true,
                newOrEditDialog: 'new',
                newActivityName: '',
                newActivityColor: 1,
                editActivityName: 'Games',
                editActivityColor: 8,
                editActivityId: 61,
            },
        });

        const { getByText } = render(
            <Provider store={store}>
                <ActivityDialogContainer />
            </Provider>,
        );

        expect(getByText('Add')).toBeTruthy();
    });

    it('Displays the proper editActivityName based on redux.', () => {
        const store = mockStore({
            activityDialog: {
                displayed: true,
                newActivityName: 'test name',
                newActivityColor: 1,
                newOrEditDialog: 'edit',
                editActivityName: 'Games',
                editActivityColor: 8,
                editActivityId: 61,
            },
        });

        const { getByLabelText } = render(
            <Provider store={store}>
                <ActivityDialogContainer />
            </Provider>,
        );

        expect(getByLabelText('activity-name-input').value).toBe('Games');
    });

    it('Hits the proper endpoints when the save button is pressed.', () => {
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

        const store = mockStore({
            allActivitiesList,
            activityDialog:
            {
                displayed: true,
                newActivityName: 'test',
                newActivityColor: 3,
                newOrEditDialog: 'edit',
                editActivityName: 'Games',
                editActivityColor: 8,
                editActivityId: 61,
            },
        });

        const {
            getByText,
        } = render(
            <Provider store={store}>
                <ActivityDialogContainer />
            </Provider>,
        );

        axios.post.mockImplementationOnce(() => Promise.resolve({ data: { code: 'success' } }));

        fireEvent.click(getByText('Save'));

        expect(axios.post.mock.calls[0][0]).toBe('api/edit-activity');
    });

    it('Dispatches the proper redux events when the save button is clicked.', async () => {
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

        const editedAllActivityList = [
            {
                id: 54,
                name: 'Log',
                color: 10,
            },
            {
                id: 10,
                name: 'Games Edited',
                color: 4,
            },
        ];

        const store = mockStore({
            allActivitiesList,
            activityDialog:
            {
                displayed: true,
                newActivityName: 'test',
                newActivityColor: 3,
                newOrEditDialog: 'edit',
                editActivityName: 'Games Edited',
                editActivityColor: 4,
                editActivityId: 10,
            },
        });

        const {
            getByText,
        } = render(
            <Provider store={store}>
                <ActivityDialogContainer />
            </Provider>,
        );

        axios.post.mockImplementationOnce(() => Promise.resolve({ data: { code: 'success' } }));

        fireEvent.click(getByText('Save'));

        await waitFor(() => expect(store.getActions()).not.toHaveLength(0));

        const expectedDisplayedAction = JSON.stringify({
            type: SET_ACTIVITY_DIALOG_DISPLAYED,
            activityDialogDisplayed: false,
        });
        const expectedActivitiesListAction = JSON.stringify({
            type: SET_ALL_ACTIVITIES_LIST,
            activities: editedAllActivityList,
        });
        const expectedNameAction = JSON.stringify({
            type: SET_EDIT_ACTIVITY_NAME,
            name: '',
        });
        const expectedColorAction = JSON.stringify({
            type: SET_EDIT_ACTIVITY_COLOR,
            color: 1,
        });
        const expectedIDAction = JSON.stringify({
            type: SET_EDIT_ACTIVITY_ID,
            id: -1,
        });

        const actions = store.getActions();

        // Convert actions to JSON because array.includes doesn't work on objects
        const jsonActions = actions.map((x) => JSON.stringify(x));
        expect(jsonActions.includes(expectedDisplayedAction)).toBeTruthy();
        expect(jsonActions.includes(expectedActivitiesListAction)).toBeTruthy();
        expect(jsonActions.includes(expectedNameAction)).toBeTruthy();
        expect(jsonActions.includes(expectedColorAction)).toBeTruthy();
        expect(jsonActions.includes(expectedIDAction)).toBeTruthy();
    });

    it('Displays delete activity button when editActivityDialog is displayed.', () => {
        const store = mockStore({
            activityDialog:
            {
                displayed: true,
                newActivityName: 'test',
                newActivityColor: 3,
                newOrEditDialog: 'edit',
                editActivityName: 'Games',
                editActivityColor: 8,
                editActivityId: 61,
            },
        });

        const {
            getByText,
        } = render(
            <Provider store={store}>
                <ActivityDialogContainer />
            </Provider>,
        );

        expect(getByText('Delete Activity')).toBeTruthy();
    });

    it('Hits the proper endpoints when delete activity is pressed.', () => {
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

        const store = mockStore({
            allActivitiesList,
            activityDialog:
            {
                displayed: true,
                newActivityName: '',
                newActivityColor: 1,
                newOrEditDialog: 'edit',
                editActivityName: 'Games',
                editActivityColor: 8,
                editActivityId: 10,
            },
        });

        const {
            getByText,
        } = render(
            <Provider store={store}>
                <ActivityDialogContainer />
            </Provider>,
        );

        axios.post.mockImplementationOnce(() => Promise.resolve({ data: { code: 'success' } }));

        fireEvent.click(getByText('Delete Activity'));

        expect(axios.post.mock.calls[0][0]).toBe('api/delete-activity');
    });

    it('Dispatches the proper redux events when the delete activity button is clicked.', async () => {
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

        const editedAllActivityList = [
            {
                id: 54,
                name: 'Log',
                color: 10,
            },
        ];

        const store = mockStore({
            allActivitiesList,
            activityDialog:
            {
                displayed: true,
                newActivityName: 'test',
                newActivityColor: 3,
                newOrEditDialog: 'edit',
                editActivityName: 'Games Edited',
                editActivityColor: 4,
                editActivityId: 10,
            },
        });

        const {
            getByText,
        } = render(
            <Provider store={store}>
                <ActivityDialogContainer />
            </Provider>,
        );

        axios.post.mockImplementationOnce(() => Promise.resolve({ data: { code: 'success' } }));

        fireEvent.click(getByText('Delete Activity'));

        await waitFor(() => expect(store.getActions()).not.toHaveLength(0));

        const expectedDisplayedAction = JSON.stringify({
            type: SET_ACTIVITY_DIALOG_DISPLAYED,
            activityDialogDisplayed: false,
        });
        const expectedActivitiesListAction = JSON.stringify({
            type: SET_ALL_ACTIVITIES_LIST,
            activities: editedAllActivityList,
        });
        const expectedNameAction = JSON.stringify({
            type: SET_EDIT_ACTIVITY_NAME,
            name: '',
        });
        const expectedColorAction = JSON.stringify({
            type: SET_EDIT_ACTIVITY_COLOR,
            color: 1,
        });
        const expectedIDAction = JSON.stringify({
            type: SET_EDIT_ACTIVITY_ID,
            id: -1,
        });

        const actions = store.getActions();

        // Convert actions to JSON because array.includes doesn't work on objects
        const jsonActions = actions.map((x) => JSON.stringify(x));
        expect(jsonActions.includes(expectedDisplayedAction)).toBeTruthy();
        expect(jsonActions.includes(expectedActivitiesListAction)).toBeTruthy();
        expect(jsonActions.includes(expectedNameAction)).toBeTruthy();
        expect(jsonActions.includes(expectedColorAction)).toBeTruthy();
        expect(jsonActions.includes(expectedIDAction)).toBeTruthy();
    });
});
