import React from 'react';
import {
    render,
    fireEvent,
} from '@testing-library/react';

import Btn from '../index.jsx';

describe('ActivityNameContainer', () => {
    it('Calls the click handler function passed to it.', () => {
        const mockCallbackStop = jest.fn();
        const mockCallbackStart = jest.fn();

        const { getByText } = render(
            <div>
                <Btn callback={mockCallbackStop} text='Delete' />
                <Btn callback={mockCallbackStart} text='Save' />
            </div>,
        );

        fireEvent.click(getByText('Delete'));
        fireEvent.click(getByText('Save'));

        expect(mockCallbackStop.mock.calls.length).toBe(1);
        expect(mockCallbackStart.mock.calls.length).toBe(1);
    });

    it('Displays the text passed to it.', () => {
        const { getByText } = render(
            <Btn callback={() => { }} text='test text' />,
        );

        expect(getByText('test text')).toBeTruthy();
    });
});
