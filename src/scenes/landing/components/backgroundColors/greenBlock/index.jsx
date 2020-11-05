import React from 'react';

import style from './style/style.module.scss';

function GreenBlock() {
    return (
        <div className={style.container}>
            <div className={style.leftFiller}></div>
            <div className={style.greenBlock}></div>
        </div>
    );
}

export default GreenBlock;
