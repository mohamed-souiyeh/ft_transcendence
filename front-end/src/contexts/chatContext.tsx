import { createContext, useContext, useState, PropsWithChildren  } from 'react';

export const DmContext = createContext({
  dm: {},
  setDm: (dm: object) => {},
});


export const DmProvider = ({ children }: PropsWithChildren<{}>) => {
  const [dm, setDm] = useState({});

  return (
    <DmContext.Provider value={{ dm, setDm }}>
      {children}
    </DmContext.Provider>
  );
};

export const useDmContext = () => {
  const context = useContext(DmContext);

  if (!context) {
    throw new Error('Context must be used inside the Provider');
  }

  return context;
};




