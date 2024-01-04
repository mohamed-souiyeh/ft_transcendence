import { useContext } from "react"
import { UserContext } from "../App"
import axios from "axios"
import {useNavigate} from "react-router-dom"
import Cookies from 'js-cookie';

function Loading() {

  const {user, setUser}  = useContext(UserContext)
  const navigate = useNavigate();

  axios.get("http://localhost:1337/users/allforhome", {
    withCredentials: true
  })
    .then((resp) => {
      setUser(prevUser => ({ ...prevUser, data: resp.data }))
      Cookies.set('user', JSON.stringify(resp.data) );
      if (!user.data.isProfileSetup){
        console.log('hhhhhhh')
        navigate("/setup")
      }
      else
        navigate("/home")
    })
    .catch((err)=> {
      console.log("My sad potato we have an error:", err)
      navigate("/login")
    })

  return (
    <>
      <div className="grid place-content-center w-screen h-screen bg-gradient-to-br from-purple-sh-2 from-10% via-purple-sh-1 via-30% to-purple ">
        <div className="h-14 w-14">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <circle fill="#C0B7E8" stroke="#C0B7E8" strokeWidth="15" r="15" cx="40" cy="65">
              <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#C0B7E8" stroke="#C0B7E8" strokeWidth="15" r="15" cx="100" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#C0B7E8" stroke="#C0B7E8" strokeWidth="15" r="15" cx="160" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0">
            </animate>
            </circle>
          </svg>
        </div>
      </div>
    </>
  )
}

export default Loading
