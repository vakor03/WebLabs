import React from 'react';
import './spinnet.styles.css';

function Spinner() {
    return (
        <div className={'lds-default'}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}

export default Spinner;
