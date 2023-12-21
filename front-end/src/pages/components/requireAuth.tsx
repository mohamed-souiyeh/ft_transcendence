import { useLocation, Outlet, Navigate } from "react-router-dom"
import { useContext } from 'react'
import { AuthContext } from '../../App'

function RequireAuth() {
  const {auth, setAuth} = useContext(AuthContext)
  setAuth(auth)
  console.log("auth is :", auth)
  return (
    <>
    { auth ? <Outlet/> : <Navigate to="/login" state={{from: useLocation() }} replace/> }
  </>
  )
}

export default RequireAuth
