import NavBar from "./components/navbar";
import SideBar from "./components/sidebar";
import Popup from "./components/twofa";
import  img  from "../assets/taha.jpg";
import trophy from "../assets/trophy.png";
import star from "../assets/star.png";
import games from "../assets/controller.png"
import { Switch, ConfigProvider } from "antd";
import { useContext, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";




function Profile () {



  const [switchValue, setSwitchValue] = useState(false);
  const [prompt, setPrompt] = useState(false);
  // const [qrCode, setCode] = useState(null);
  
  //--------------The Code below is for testing purpose:

  console.log('hi')
      axios.get("http://localhost:1337/auth/refresh", {
        withCredentials: true
      })
        .then((resp) => {
            console.log("we have as a resp:", resp)
        })
        .catch((err)=> {
          console.log('SIKE~!', err)
            if (err.response) {
              if(err.response.status == 401){
              console.log("this user is not Authenticated")
            }
          }
        })
  //----------------------------




  const {user} = useContext(UserContext)

  return(
    <>
      <div className="grid justify-center w-screen h-screen bg-gradient-to-br from-purple-sh-2 from-10% via-purple-sh-1 via-30% to-purple ">
        <SideBar/>
        <NavBar/>

        {prompt && <Popup switchValue={switchValue} setSwitchValue={setSwitchValue} prompt={prompt} 
          setPrompt={setPrompt}
        />}
        <div className="bg-purple bg-opacity-10 backdrop-blur-lg border-[1px] border-purple/20 h-64 mt-20 mb-16 rounded-3xl flex">
          <div className="grid place-content-center">
            <div className="bg-purple-sh-2 m-12 rounded-full h-48 w-48 grid place-content-center ">
              <img className="rounded-full h-44 w-44" src={img} />
            </div>
          </div >
          <div className=" m-6 grid place-content-center">
            <p className="text-2xl m-2"> Nickname </p>
            <p className="text-2xl m-2"> Current level </p>
            <p className="text-2xl m-2"> Rank on server </p>
            <p className="text-2xl m-2"> 2fa state </p>
          </div>
          <div className=" m-6 grid place-content-center">
            <p className="text-2xl m-2">:  {user.username}</p>
            <p className="text-2xl m-2">:  20</p>
            <p className="text-2xl m-2">:  05</p>
            <div className="flex ">
              <p className="text-2xl m-2">:  </p>
              <div className="pt-3">
                <ConfigProvider theme={{ token: { colorPrimary: '#8176AF',  }, }} >
                  <Switch className="bg-purple-sh-1" checkedChildren="On" unCheckedChildren='Off' 
                    defaultChecked={false} //default here should be based on what's on the database.
                    checked={switchValue}
                    onChange={() => setPrompt(true)}
                  />
                </ConfigProvider>
                {
                  //here, we should show the popup if the switch was clicked.
                  //based on the popup buttons, either just hide the pop(No is clicked) or confirm the state changing (yes clicked), to change the state, switchValue will change to !switchValue
                  //in other words, popup component will take 'switchValue' and setSwitchValue to change in the case of clicking on yes.
                }
              </div>
            </div>
          </div>
        </div>

        <div className="h-32 flex place-content-center mb-16">
          <div className="bg-purple bg-opacity-10 border-[1px] border-purple/30 h-44 w-44 mx-8 mt-2 rounded-3xl grid place-content-center hover:bg-opacity-30">
            <div className="grid place-content-center">
              <img className="h-28 w-28 pt-2" src={star} />
            </div>
            <div className="grid place-content-center pt-5">
              <p className="text-xl text-purple-tone-2 text-opacity-50">Achievs</p>
            </div>
          </div>
          <div className="bg-purple bg-opacity-10 backdrop-blur-lg border-[1px] border-purple/30 h-48 w-48 mx-8 rounded-3xl grid place-content-center hover:bg-opacity-30">
            <div className="grid place-content-center">
              <img className="h-28 w-28 pt-2" src={trophy} />
            </div>
            <div className="grid place-content-center pt-9">
              <p className="text-xl text-purple-tone-2 text-opacity-50">Wins</p>
            </div>
          </div>
          <div className="bg-purple bg-opacity-10 border-[1px] border-purple/30 h-44 w-44 mx-8 mt-2 rounded-3xl grid place-content-center hover:bg-opacity-30">
            <img className="h-28 w-28 pt-2" src={games} />
            <div className="grid place-content-center pt-5">
              <p className="text-xl text-purple-tone-2 text-opacity-50">Matchs</p>
            </div>
          </div>
        </div>


        <div className="flex  overflow-hidden mt-16">

          <div className="grid justify-center mx-4">
            <div className="h-[100%]  w-[500px] rounded-t-3xl overflow-hidden">
              <div className="bg-purple-sh-2 h-[100%]  w-[500px] rounded-t-3xl overflow-auto scrollbar-thin scrollbar-thumb-purple-sh-1 ">
                <div className="sticky top-0 flex place-content-between bg-purple-sh-2 bg-opacity-70 backdrop-blur-sm rounded-t-3xl px-2 py-4 z-0" >
                  <p className="text-xl text-purple-tone-2 text-opacity-50">Matchs History:</p>
                </div>
                <p className=" text-2xl text-impure-white text-opacity-50"> Player Vs Player</p> 
                {/* we need a component for opponents, that will show their name, image, and score from that match*/}
              </div>
            </div>
          </div>

          <div className="grid justify-center">
            <div className="h-[100%]  w-[350px] rounded-t-3xl overflow-hidden">
              <div className="bg-purple-sh-2 h-[100%]  w-[350px] rounded-t-3xl overflow-auto scrollbar-thin scrollbar-thumb-purple-sh-1">
                <div className="sticky top-0 flex place-content-between bg-purple-sh-2 bg-opacity-70 backdrop-blur-sm rounded-t-3xl px-2 py-4 z-0" >
                  <p className="text-xl text-purple-tone-2 text-opacity-50">acheivements:</p>
                </div>
                <p className="text-xl text-purple-tone-2 text-opacity-50">acheivement</p>
                <p className="text-xl text-purple-tone-2 text-opacity-50">acheivement</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
export default Profile
