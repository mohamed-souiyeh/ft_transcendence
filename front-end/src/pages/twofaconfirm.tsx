import axios from 'axios'
import logo from '../assets/Logo.svg'
import { useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { UserContext } from '../App'

function TwoFAConfirmation () {

  const {user} = useContext(UserContext)
  const [errMsg, setErrMsg] = useState("")
  const nav = useNavigate()
  let formdata = new FormData()


  const verifyCode = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const Code = e.target.verfCode.value; 
    formdata.set("code", Code);

    axios.post(`${process.env.REACT_URL}:1337/2fa/verify`, formdata ,{
      withCredentials: true, 
      headers:{
        'Content-Type' : 'multipart/formdata'
      }
    })
      .then((res) => {
        if (res.status == 200){
          // console.log("success")
          nav("/loading")
        }
      })
      .catch((err) => {
        // console.log("errororor; ", err)
        if (err.status != 401){
          setErrMsg("Error! Wrong code.")
        }
      })
  }

  if (user.data.isAuthenticated){
    return( nav("/home") )
  }

  return (
    <>
      <div className="grid place-content-center w-screen h-screen bg-gradient-to-br from-purple-sh-2 from-10% via-purple-sh-1 via-30% to-purple ">
        <div className="grid place-content-center">
          <img className='w-32 h-32' src={logo}/>
        </div>
        <div className="grid place-content-center pt-2">
          <h1 className='text-purple-tone-1'>2FA authentication</h1>
        </div>
        <div className="grid place-content-end pb-2">
          <p className='text-purple-tone-2 text-xs'> Please open Google's Authenticator App and Enter the code below</p>
        </div>

        <form onSubmit={verifyCode} className='grid place-content-center pt-8'>
          <input type='text' name="verfCode" placeholder="Enter 6 digits code" className='w-[440px] h-12 bg-purple-sh-2 outline-none rounded-lg text-impure-white px-2 place-self-center' />
          
          <div className="text-[#D9534F] font-bold font-mono pl-4" >
            {errMsg}
          </div>

          <div className='grid place-content-center p-3'>
            <button className="w-[440px] rounded-lg bg-purple focus:outline-none border-none hover:bg-purple-sh-2"  type="submit" value="Send"> Confirm </button>
          </div>
        </form >

        <div className="flex ">
          <p className='text-purple-tone-2 text-xs pl-3 pr-1'> can't access your code? sounds like a </p>
          <p className='text-purple-sh-2 text-xs font-bold'> YOUUU problem!</p>
        </div>
      </div>     
    </>
  )
}


export default TwoFAConfirmation;
