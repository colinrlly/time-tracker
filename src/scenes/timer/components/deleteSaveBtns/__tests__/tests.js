import React from 'react';
import {
    render,
    fireEvent,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import axios from 'axios';

import {
    SET_HAS_UNSAVED_ACTIVITY_RECORD,
} from '../../../../../redux/actions';

import DeleteSaveButtons from '../index.jsx';

const mockStore = configureStore([]);
jest.mock('axios');
axios.post.mockImplementation(() => Promise.resolve({ data: { code: 'success' } }));

describe('DeleteSaveBtns', () => {
    function setUpHasUnsavedActivityRecordTrue() {
        const store = mockStore({
            hasUnsavedActivityRecord: true,
        });

        const { getByText } = render(
            <Provider store={store}>
                <DeleteSaveButtons />
            </Provider>,
        );

        return {
            store,
            getByText,
        };
    }

    it('Displays itself when hasUnsavedActivityRecord is true in Redux.', () => {
        const {
            getByText,
        } = setUpHasUnsavedActivityRecordTrue();

        expect(getByText('Delete')).toBeTruthy();
        expect(getByText('Save')).toBeTruthy();
    });

    it('Doesn\'t display itself when hasUnsavedActivityRecord is false in Redux.', () => {
        const store = mockStore({
            hasUnsavedActivityRecord: false,
        });

        const { queryByText } = render(
            <Provider store={store}>
                <DeleteSaveButtons />
            </Provider>,
        );

        expect(queryByText('Delete')).toBeNull();
        expect(queryByText('Save')).toBeNull();
    });

    it('Hits the proper endpoints when the buttons are clicked.', () => {
        const {
            getByText,
        } = setUpHasUnsavedActivityRecordTrue();

        fireEvent.click(getByText('Delete'));
        expect(axios.post.mock.calls[0][0]).toBe('api/delete-activity-record');

        fireEvent.click(getByText('Save'));
        expect(axios.post.mock.calls[1][0]).toBe('api/save-activity');
    });

    it('Dispatches the proper Redux actions when save is clicked.', (done) => {
        const {
            store,
            getByText,
        } = setUpHasUnsavedActivityRecordTrue();

        fireEvent.click(getByText('Save'));

        const expectedHasUnsavedAction = JSON.stringify({
            type: SET_HAS_UNSAVED_ACTIVITY_RECORD,
            hasUnsavedActivityRecord: false,
        });

        setTimeout(() => {
            const actions = store.getActions();

            // Convert actions to JSON because array.includes doens't work on objects
            const jsonActions = actions.map((x) => JSON.stringify(x));

            expect(jsonActions.includes(expectedHasUnsavedAction)).toBeTruthy();
            done();
        }, 1000);
    });

    it('Dispatches the proper Redux actions when delete is clicked.', (done) => {
        const {
            store,
            getByText,
        } = setUpHasUnsavedActivityRecordTrue();

        fireEvent.click(getByText('Delete'));

        const expectedHasUnsavedAction = JSON.stringify({
            type: SET_HAS_UNSAVED_ACTIVITY_RECORD,
            hasUnsavedActivityRecord: false,
        });

        setTimeout(() => {
            const actions = store.getActions();

            // Convert actions to JSON because array.includes doens't work on objects
            const jsonActions = actions.map((x) => JSON.stringify(x));

            expect(jsonActions.includes(expectedHasUnsavedAction)).toBeTruthy();
            done();
        }, 1000);
    });
});
