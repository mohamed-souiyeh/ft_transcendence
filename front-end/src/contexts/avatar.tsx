import  { createContext, useContext, useState, PropsWithChildren  } from 'react';

type ContextType = {
  avatar: string;
  setAvatar: (avatar: string) => void;
};


export const AvatarContext = createContext<ContextType | undefined>(undefined);


export const AvatarProvider = ({ children }: PropsWithChildren<{}>) => {
  // const [avatar, setAvatar] = useState("")
  const [avatar, setAvatar] = useState<ContextType['avatar']>('');


  return (
    <AvatarContext.Provider value={{ avatar, setAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatarContext = () => {
  const context = useContext(AvatarContext);

  if (!context) {
    throw new Error('AvatarContext must be used inside the Provider');
  }

  return context;
};




