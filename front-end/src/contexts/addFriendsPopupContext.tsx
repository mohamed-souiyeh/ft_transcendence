import React, { createContext, useContext, useState, PropsWithChildren  } from 'react';

  interface MyContextType {
  addFriendsPopup: boolean,
  setAddFriendsPopup: React.Dispatch<React.SetStateAction<boolean>>
};

export const AddFriendsPopupContext  = createContext<MyContextType | undefined>(undefined);


export const AddFriendsPopupProvider = ({ children }: PropsWithChildren<{}>) => {
  const [addFriendsPopup, setAddFriendsPopup] = useState(false);

  return (
    <AddFriendsPopupContext.Provider value={{ addFriendsPopup, setAddFriendsPopup }}>
      {children}
    </AddFriendsPopupContext.Provider>
  );
};

export const useAddFriendsPopupContext = () => {
  const context = useContext(AddFriendsPopupContext);

  if (!context) {
    throw new Error('Context must be used inside the Provider');
  }

  return context;
};

