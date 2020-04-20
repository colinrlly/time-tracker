import React from 'react';
import {
    render,
    fireEvent,
} from '@testing-library/react';

import ActivityDialog from '../index.jsx';

describe('ActivityNameContainer', () => {
    it('Calls the exitBtnCallback function passed to it.', () => {
        const mockCallback = jest.fn();

        const { getByText } = render(
            <ActivityDialog
                exitBtnCallback={mockCallback}
                activityNameInputCallback={() => { }}
                activityName={''}
                colorBtnCallback={() => { }}
                selectedColor={'1'} />,
        );

        fireEvent.click(getByText('+'));

        expect(mockCallback.mock.calls.length).toBe(1);
    });
});
