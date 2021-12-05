import React from 'react';
import classes from './pop-up.styles.css';

class Popup extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div className={classes.popUp}>{this.props.children}</div>;
    }
}

export default Popup;
