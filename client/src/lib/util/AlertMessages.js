import React from 'react';
import './AlertMessages.css';

const AlertMessages = ({ message, status }) => {

    const classNameValue = status === undefined ? 'alert alert-success' : "alert alert-" + status;

    return (
        <div className={classNameValue} role="alert">
            {message}
        </div>
    );
}
export default AlertMessages;