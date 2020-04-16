import React from 'react';
import {
    render,
    fireEvent,
} from '@testing-library/react';

import Btn from '../index.jsx';

describe('ActivityNameContainer', () => {
    it('Calls the click handler function passed to it.', () => {
        const mockCallback = jest.fn();

        const { getByText } = render(
            <div>
                <Btn callback={mockCallback} text='Delete' />
            </div>,
        );

        fireEvent.click(getByText('Delete'));

        expect(mockCallback.mock.calls.length).toBe(1);
    });

    it('Displays the text passed to it.', () => {
        const { getByText } = render(
            <Btn callback={() => { }} text='test text' />,
        );

        expect(getByText('test text')).toBeTruthy();
    });
});
