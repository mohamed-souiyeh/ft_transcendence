import React, { createContext, useContext, useState, PropsWithChildren  } from 'react';

export const PwdPopupContext = createContext({
  pwdPopup: false,
  setPwdPopup: React.Dispatch<React.SetStateAction<boolean>>
});


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

