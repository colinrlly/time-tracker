import React from 'react';

import {
    Btn,
} from './components';

function DeleteSaveBtns() {
    return (
        <div>
            <Btn callback={() => alert('hello there delete')} text='Delete' />
            <Btn callback={() => alert('hello there save')} text='Save' />
        </div>
    );
}

export default DeleteSaveBtns;
