import { useContext, useEffect } from "react"
import { UserContext } from "../App"
import axios from "axios"
import { Navigate, useNavigate} from "react-router-dom"
import Cookies from 'js-cookie';

function Loading() {

  const {user, setUser}  = useContext(UserContext)
  const navigate = useNavigate();

  useEffect( () => {
    if (!Object.keys(user).length){ 
      axios.get("http://localhost:1337/users/allforhome", {
        withCredentials: true
      })
        .then((resp) => {
          setUser(resp.data)
               Cookies.set('user', JSON.stringify(resp.data) );
        })
        .catch((err)=> {
          console.log('SIKE~!', err)
            if (err.response) {
              if(err.response.status == 401){
              console.log("this user is not Authenticated")
              navigate("/home")
            }
          }
          else 
              navigate("/home")
        })
    }
  }, [user] 
  )

  if (Object.keys(user).length)
  return(
    <>
      { <Navigate to="/home" />}
    </>
  )
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
