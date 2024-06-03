import React, { useState } from 'react';
import { NotificationContext } from './NotificationContext';

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState('');
    const [color, setColor] = useState('#32cd32'); // default color

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => {
            setNotification('');
        }, 3000); // Hide notification after 3 seconds
    };

    return (
        <NotificationContext.Provider value={{ notification, color, showNotification, setColor }}>
            {children}
        </NotificationContext.Provider>
    );
};