import { useState } from "react";
import { createContext } from "react";


const AuthContext = createContext({});


export const AuthProvider = ({ children } :any) => {
  const [isAuth, setIsAuth] = useState(false)

  //everyone be passing setter of auth state, ig we don't need to since we're not the ones authentiicating ppl, but we're just checking on wether they are or not.

  return (
    <AuthContext.Provider value={isAuth} >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
