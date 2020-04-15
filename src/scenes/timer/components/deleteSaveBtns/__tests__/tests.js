import React from 'react';
import {
    render,
    fireEvent,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import axios from 'axios';

import DeleteSaveButtons from '../index.jsx';

const mockStore = configureStore([]);
jest.mock('axios');

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

    xit('Dispatches the proper Redux actions when buttons are clicked.', () => {

    });
});
