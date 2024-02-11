import { useLocation, Outlet, Navigate } from "react-router-dom"
import { useContext } from 'react'
import { UserContext } from '../../App'

function RequireAuth() {

  const {user} = useContext(UserContext)

  const location = useLocation();
  // console.log("isAuthed: ", user.data.isAuthenticated)
  return (
    <>
    { user.data.isAuthenticated ? <Outlet/> : <Navigate to="/login" state={{from: location }} replace/> }
  </>
  )
}

export default RequireAuth
