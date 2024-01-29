import { useState , useRef, useContext} from "react";
import camera from "../assets/camera.svg"
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App";
import Cookies from 'js-cookie';


function Setup()
{
  const {user, setUser} = useContext(UserContext)

  //NOTE - from here start the code comunicationg with the back_end
  let inputRef = useRef(null);
  let [srcImg, setProfilePic] = useState("");
  // SetStateAction<string>
  let [userName, setName] = useState("");
  let formdata = new FormData();
  let [userNameMessage, setUsername] = useState("This nickname is already taken, like your crush");
  let [errMsg, setErrMsg] = useState("");
  // let [badUserName, setBadUserName] = useState(false)
  const navigate = useNavigate();

  const click = () =>
{
    if (inputRef.current)
    inputRef.current.click();
  };

  const onUserInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value);
  };


  const change = (event: React.ChangeEvent<HTMLInputElement>): void =>
{
    if(event.target.files && event.target.files.length > 0 && event.target.files[0].type != "image/png" && event.target.files[0].type != "image/jpeg"){
      setErrMsg("Bad file format! please use a .jpeg or .png file")
    }
    else if(event.target.files && event.target.files.length > 0 && event.target.files[0].size >=  1024 * 1024 * 5){
      setErrMsg("File Too large, we're not Nasa plz choose a smaller file")
    }
    else
      setProfilePic(event.target.files[0]);
  };


  const changeBoth = () =>
{
    // console.log("username is :", `|${userName}|`);
    console.log("image is :", srcImg);


    if (userName.length)
      formdata.set("username", userName);
    // I need mohamad to test if this is working ..
    // if(!srcImg)
    //   setProfilePic("../assets/star.png")
    if (srcImg)
      formdata.set("avatar", srcImg);

    axios.
      post("http://localhost:1337/users/update", formdata,
        {
          withCredentials: true
        })
      .then( (res)=> {
        // console.log("type of res :", typeof res );
        // console.log("response from the back-end after update in user setup :", res);
        setUsername("");
        if (res.status == 200) {
          // navigate("/home");
          // ----------------------

          axios.get("http://localhost:1337/users/allforhome", {
            withCredentials: true
          })
            .then((resp) => {
              setUser(prevUser => ({ ...prevUser, data: resp.data }))
              Cookies.remove('user')
              Cookies.set('user', JSON.stringify(resp.data));
            })
            .catch((err)=> {
              console.log("My sad potato we have an error:", err);
            })

          // ----------------------
          navigate("/home")
        }
      })
      .catch((e)=>{
        console.log("My sad potato we have an error:", e);
        // console.log(e.response.data.message);
        setErrMsg(e.response.data.message)
        setUsername(e.response);
      });

    // setBadUserName(true);
  }

  if (!Object.keys(user.data).length || user.data.isProfileSetup)
  return(
    <>
      { <Navigate to='/home' />}
    </>
  )

  return <>
    <div className="grid place-content-center gap-5 w-screen h-screen bg-gradient-to-br from-purple-sh-2 from-10% via-purple-sh-1 via-30% to-purple ">
      <div className="grid place-content-center" >
        <div className="flex" >
          <p className="text-4xl text-purple mr-2"> Welcome! </p>
          <p className="text-4xl text-impure-white mr-2"> Let’s create your profile. </p> 
        </div>
        <div >
          <p className="text-xl text-purple-tone-2/70"> please choose a unique nickname </p>
        </div>
      </div>
      <label>
        {/* username: */}
        <input onChange={onUserInput} type="text" placeholder="Enter Nickname" className="w-72 bg-purple bg-opacity-0 border-b-2 rounded-l-sm pl-1 rounded-r-md border-purple outline-none"
        />
      </label>
      <div className="text-[#D9534F] font-bold font-mono" >
        {errMsg}
        {/* {badUserName && userNameMessage} */}
      </div>
      <div
        className="grid "
      >
        <div style={{ height: '166px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '20px', display: 'flex', }} >
          <div className="flex gap-8" >
            <div onClick={click} className="grid place-self-start">
              <form name="avatar" encType="multipart/form-data">
                {srcImg ? <img src={URL.createObjectURL(srcImg)} className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple hover:cursor-pointer" alt="" /> :
                  <div className="grid place-content-center w-32 h-32 border-4 border-purple hover:cursor-pointer rounded-full hover:bg-purple/30" >
                    <img src={camera} className="w-10 h-10" alt="Had tswira mkaynach"/>
                  </div>
                }
                <input type="file" ref={inputRef} onChange={change} style= {{ display: 'none' }} />
              </form>
            </div>
            <div className="grid place-content-center w-72" >
              <p className="text-lg text-purple-tone-1/40"> a default avatar will be set for you if this step was skipped. </p>
            </div>
          </div>
        </div>
        <div className="grid place-content-center">
          <button className="w-36 h-10 rounded-full bg-purple focus:outline-none border-none hover:bg-purple-sh-2 font-bold text-purple-sh-2 hover:text-impure-white" 
            onClick={changeBoth}>
            Continue
          </button>
        </div>
      </div>
    </div>
  </>
}

export default Setup;
