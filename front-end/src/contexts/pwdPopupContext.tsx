import React, { createContext, useContext, useState, PropsWithChildren  } from 'react';

  interface MyContextType {
  pwdPopup: boolean,
  setPwdPopup: React.Dispatch<React.SetStateAction<boolean>>
};

export const PwdPopupContext  = createContext<MyContextType | undefined>(undefined);


export const PwdPopupProvider = ({ children }: PropsWithChildren<{}>) => {
  const [pwdPopup, setPwdPopup] = useState(false);

  return (
    <PwdPopupContext.Provider value={{ pwdPopup, setPwdPopup }}>
      {children}
    </PwdPopupContext.Provider>
  );
};

export const usePwdPopupContext = () => {
  const context = useContext(PwdPopupContext);

  if (!context) {
    throw new Error('Context must be used inside the Provider');
  }

  return context;
};

