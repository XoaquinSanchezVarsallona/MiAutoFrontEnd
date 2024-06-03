import React from 'react';

export const NotificationContext = React.createContext({
  notification: null,
  color: '#32cd32', // default color
  showNotification: () => {},
  setColor: () => {},
});