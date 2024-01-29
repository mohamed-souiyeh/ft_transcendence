import axios from "axios";
import Logo from "../../assets/Logo.svg"
import Cookies from 'js-cookie'
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../App";

function Logout({open, onClose} : {open : boolean, onClose : () => any;})  {

  const nav = useNavigate()
  const {user, setUser} = useContext(UserContext)

  const logout = () => {
    axios.get(`${process.env.REACT_URL}:1337/auth/logout`, {
      withCredentials: true
    })
    .then((resp) => {
        if (resp.status == 200){
          // console.log("user successfully logged out")
          Cookies.remove('user')
          user.chat.disconnect();
          setUser({ data: {} })
          nav("/login")
        }
      })
    .catch( (err) => {
        console.log("there's no where to run", err)
      })
  }

  if (!open) return null
  return (
    <>
      <div onClick={onClose} className="w-screen h-screen absolute grid place-content-center z-50">
        <div onClick={ (e) => {e.stopPropagation()}} className="h-[500px] w-[400px] bg-purple-tone-2 backdrop-blur-md bg-opacity-10 rounded-[64px]">
          <div className="pt-16 pb-5 grid place-content-center">
            <img src={Logo} />
          </div>
          <div className="grid place-content-center py-5">
            <p className="text-3xl text-center font-bold px-2">Are you sure you want to logout?</p>
          </div>
          <div className="flex flex-row place-content-center pt-10 gap-3">
            <button onClick={logout} className="w-32 rounded-lg bg-purple focus:outline-none border-none hover:bg-purple-sh-2">Yes</button>
            <button onClick={onClose} className="w-32 rounded-lg bg-purple-sh-1 focus:outline-none border-none hover:bg-purple-sh-2">No</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Logout
