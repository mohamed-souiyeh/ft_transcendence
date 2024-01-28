import { useContext } from "react"
import { UserContext } from "../App"
import axios from "axios"
import {useNavigate} from "react-router-dom"
import Cookies from 'js-cookie';
import { useAvatarContext } from "../contexts/avatar";





//TODO - if the user have some new notifications the side bar component should be updated with a red dot
function Loading() {

  const {user, setUser}  = useContext(UserContext)
  const {setAvatar} = useAvatarContext()
  const navigate = useNavigate();

  axios.get("http://localhost:1337/users/allforhome", {
    withCredentials: true
  })
    .then((resp) => {
      setUser(prevUser => ({ ...prevUser, data: resp.data }))
      Cookies.set('user', JSON.stringify(resp.data) );
      setAvararFunction(resp.data.id)
      if (!user.data.isProfileSetup){
        navigate("/setup")
      }
      else
      navigate("/home")
    })
    .catch(()=> {
      navigate("/login")
    })


  const setAvararFunction = (id : string) => { 
    axios.get("http://localhost:1337/users/"+ id+ '/avatar',
      {
        withCredentials: true,
        responseType: 'arraybuffer'
      })
      .then((response) => {
        if (response.status == 200) {
          let image = btoa(
            new Uint8Array(response.data)
              .reduce((data, byte) => data + String.fromCharCode(byte), '')
          );

          const base64Image =`data:${response.headers['content-type'].toLowerCase()};base64,${image}` 

          setAvatar(base64Image)
          localStorage.setItem('avatar', base64Image);
        }
      }).catch((err) => {
        console.log("an error occured in Loading.tsx while trying to get the avatar ", err)
      });
  }

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
