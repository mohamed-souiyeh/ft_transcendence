import React, { createContext, useContext, useState, PropsWithChildren  } from 'react';

  interface MyContextType {
  notification: boolean,
  setNotification: React.Dispatch<React.SetStateAction<boolean>>
};

export const NotificationContext  = createContext<MyContextType | undefined>(undefined);


export const NotificationProvider = ({ children }: PropsWithChildren<{}>) => {
  const [notification, setNotification] = useState(false);

  return (
    <NotificationContext.Provider value={{ notification, setNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('Context must be used inside the Provider');
  }

  return context;
};

