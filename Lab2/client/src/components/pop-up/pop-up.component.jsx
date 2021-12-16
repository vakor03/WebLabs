import React from 'react';
import './pop-up.styles.css';

const PopUp = ({active, setActive, children}) => {
    return(
        <div className={active ? "popUp active": "popUp"} onClick={()=> setActive(false)}>
            <div className={"popUp_content"} onClick={e=> e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}

export default PopUp;
