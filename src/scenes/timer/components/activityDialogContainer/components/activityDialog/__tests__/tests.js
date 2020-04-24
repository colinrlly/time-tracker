import React from 'react';
import {
    render,
    fireEvent,
} from '@testing-library/react';

import ActivityDialog from '../index.jsx';

describe('ActivityNameContainer', () => {
    it('Calls the exitBtnCallback function passed to it.', () => {
        const mockCallback = jest.fn();

        const { getByTestId } = render(
            <ActivityDialog
                exitBtnCallback={mockCallback}
                activityNameInputCallback={() => { }}
                activityName={''}
                colorBtnCallback={() => { }}
                selectedColor={1}
                submitCallback={() => { }}
                submitText={'Save'}
                showDelete={false}
                deleteActivityCallback={() => { }}
                currentActivity={{
                    id: 54,
                    name: 'Games',
                    color: 3,
                }} />,
        );

        fireEvent.click(getByTestId('exitBtn'));

        expect(mockCallback.mock.calls.length).toBe(1);
    });
});
