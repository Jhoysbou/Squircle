import React from "react";
import s from '../style/cardFragment.module.css';

export default function CardFragment(props) {
    const drawNumber = () => {
        switch (props.number) {
            case "ONE":
                return s.one;
            case "TWO":
                return s.two;
            case "THREE":
                return s.three;
        }
    }

    return (
        <div className={s.wrapper}>
            <div className={`${s.number} ${drawNumber()}`}/>
            <div className={s.content}>
                {props.children}
            </div>
        </div>
    );
};
