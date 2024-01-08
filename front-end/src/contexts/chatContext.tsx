// import { PropsWithChildren, createContext, useContext, useState } from 'react';

// type ContextType = [object, (user: object) => void];

// export const userContext = createContext<ContextType | undefined>(undefined);

// export const userProvider = ({ children }: PropsWithChildren<{}>) => {
//   const value = useState({});

//   return (
//     <userContext.Provider value={value}>
//       {children}
//     </userContext.Provider>
//   );
// };

// export const useUserContext = () => {
//   const context = useContext(userContext);

//   if (!context) {
//     throw new Error('useUserContext must be used inside the ThemeProvider');
//   }

//   return context;
// };

//-------------------------------------------------------
//
// import { PropsWithChildren, createContext, useContext, useState } from 'react';

// type ContextType = {
//   user : object;
//   setUser : (user: object) => void;
// };

// export const userContext = createContext<ContextType | undefined>(undefined);

// export const ThemeProvider = ({ children }: PropsWithChildren<{}>) => {
//   const [user, setUser] = useState<ContextType['user']>({});

//   return (
//     <userContext.Provider value={{user , setUser }}>
//       {children}
//     </userContext.Provider>
//   );
// };

// export const useUserContext = () => {
//   const context = useContext(userContext);

//   // if (!context) {
//   //   throw new Error('useUserContext must be used inside the ThemeProvider');
//   // }

//   return context;
// };



//-------------------------------------------------------
///

// context.js
// import { createContext, useContext, useState } from 'react';

// export const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   const [theme, setTheme] = useState('dark');

//   return (
//     <ThemeContext.Provider value={{ theme, setTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useThemeContext = () => {
//   const context = useContext(ThemeContext);

//   if (!context) {
//     throw new Error('useThemeContext must be used inside the ThemeProvider');
//   }

//   return context;
// };

//================================

import { createContext, useContext, useState, PropsWithChildren  } from 'react';

export const UserContext = createContext({
  user: {},
  setUser: (user: object) => {},
});


export const UserProvider = ({ children }: PropsWithChildren<{}>) => {
  const [user, setUser] = useState({});
  console.log('how many', user)

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    console.log( "aaaa", context)
    throw new Error('useThemeContext must be used inside the ThemeProvider');
  }

  return context;
};




