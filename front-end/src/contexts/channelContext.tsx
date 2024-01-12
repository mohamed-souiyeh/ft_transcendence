import { createContext, useContext, useState, PropsWithChildren  } from 'react';

export const ChannelContext = createContext({
  channel: {},
  setChannel: (channel: object) => {},
});


export const ChannelProvider = ({ children }: PropsWithChildren<{}>) => {
  const [channel, setChannel] = useState({});

  return (
    <ChannelContext.Provider value={{ channel, setChannel }}>
      {children}
    </ChannelContext.Provider>
  );
};

export const useChannelContext = () => {
  const context = useContext(ChannelContext);

  if (!context) {
    throw new Error('useThemeContext must be used inside the ThemeProvider');
  }

  return context;
};




