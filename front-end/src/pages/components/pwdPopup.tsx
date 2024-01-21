import logo from "../../assets/Logo.svg"
import { useEffect, useRef, useState } from "react"
import { usePwdPopupContext } from "../../contexts/pwdPopupContext"

function PwdPopup() {

  const [state, setState] = useState(false)
  const [badPwd, setBadPwd] = useState(false)
  const [confirmationPwd, setConfirmationPwd] = useState("")
  const {setPwdPopup} = usePwdPopupContext()

  //we're using this to temporary store the privacy and pwds. should be replaced ------------
  const [temporaryObj, setTemporaryObj] = useState({
    privacy : "Protected",
    Password: "",
  })
  //----------------------------------
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setState(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const setPrivacy = (prv : string) => {
    setTemporaryObj({...temporaryObj, privacy: prv} )
    setState(false)
  }

  const setPwd = (e) => {
    setTemporaryObj({...temporaryObj, Password: e.target.value} )
    setState(false)
  }

  const openOptions = () => {
    setState(!state)
  }

  const handleSubmit = (e : React.FormEvent) => {
    e.preventDefault()
    if(temporaryObj.privacy === "Protected" && (temporaryObj.Password != confirmationPwd || !temporaryObj.Password)) {
      setBadPwd(true)
    }
    else {
      console.log("we good to go!")
      setPwdPopup(true)
    }
  }

  return (
    <div className="h-screen w-screen bg-purple-sh-1 bg-opacity-30 backdrop-blur-sm absolute z-40 grid place-content-center" onClick={() => {setPwdPopup(false)}}> 
      <div className="h-[28rem] w-l-card-w bg-purple bg-opacity-20 p-4 rounded-xl grid place-content-center" onClick={ (e) => {e.stopPropagation()}}>
        <form onSubmit={handleSubmit} >
          <div className="grid place-content-center">
            <img src={logo} className="h-11 w-11" />
          </div>
            <p className="text-xl font-bold pt-4 pb-2 " > Change Privacy </p>
          <div ref={menuRef} onClick={() => {openOptions()}} className=" bg-purple-sh-1 flex items-center rounded-lg p-2 hover:cursor-pointer w-64">
            <div className="basis-11/12">
              {temporaryObj.privacy ?  <p className="text-impure-white text-lg"> {temporaryObj.privacy } </p> : <p className="text-impure-white/30 text-md"> click to select</p>}
            </div>
            <div className="basis-1/12">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                <path d="M7 8L0.0717964 0.5L13.9282 0.5L7 8Z" fill="#201E2D"/>
              </svg>
            </div>
          </div>
          { state && 
            <div ref={menuRef} className=" shadow-xl shadow-purple-sh-2 bg-purple-sh-1 rounded-lg mt-1 absolute w-64">
              <div onClick={() => {setPrivacy("Public")}} className="hover:bg-purple-sh-2 hover:cursor-pointer rounded-lg p-2">
                Public
              </div>
              <div onClick={() => {setPrivacy("Protected")}} className="hover:bg-purple-sh-2  hover:cursor-pointer rounded-lg p-2">
                Protected
              </div>
              <div onClick={() => {setPrivacy("Private")}} className="hover:bg-purple-sh-2 rounded-lg p-2 hover:cursor-pointer ">
                Private
              </div>
            </div>
          }
          { temporaryObj.privacy === "Protected" &&                 
            <div className="grid place-content-center">
              <p className="text-xl font-bold pt-4 " > Or change Password </p>
              {/* <p className="text-lg pt3" > Password: </p> */}
              <input type="password" name="password" placeholder="New password" onChange={setPwd} className="my-3 bg-purple-sh-1 rounded-lg w-64 h-12 focus:outline-none p-2 placeholder:text-impure-white/30 " />
              {/* <p className="text-lg pt-3" > confirm Password: </p> */}
              <input type="password" name="confirmedPassword" placeholder="confirm new password" onChange={(e) => {setConfirmationPwd(e.target.value)}} className="bg-purple-sh-1 rounded-lg w-64 h-12 focus:outline-none p-2 placeholder:text-impure-white/30 " />
              { badPwd && <p className="text-[#D9534F] font-bold text-sm" > Bad Password</p> }
            </div>
          }

          <div className="grid place-content-center">
            <button type="submit" className="bg-purple hover:bg-purple-tone-1 hover:text-purple-sh-1 rounded-lg object-center mt-5"> Confirm Changes </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PwdPopup
