import React from 'react';

import googleColors from '../../../../../../static/js/google_colors';

import style from './style/style.module.scss';

function ActivityDialog(props) {
    const colorButtons = Object.keys(googleColors).map(
        (x, i) => <button
            key={i}
            style={{ backgroundColor: googleColors[x] }}
            name={x}
            className={style.color} />,
    );

    return (
        <div className={style.overlay}>
            <div>
                <button onClick={props.exitBtnCallback}>+</button>
            </div>

            <div>
                <div>
                    <input type='text' placeholder='Add Title' />
                </div>

                <div className={style.colorsContainer}>
                    {colorButtons}
                </div>
            </div>

            <button>ADD</button>
        </div>
    );
}

export default ActivityDialog;
