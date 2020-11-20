import React from "react";
import s from '../style/cardFragment.module.css';

export default function CardFragment(props) {
    return (
        <div className={s.wrapper}>
            <div className={`${s.number} ${s.one}`}/>
            <div className={s.content}>
                {props.children}
            </div>
        </div>
    );
};
