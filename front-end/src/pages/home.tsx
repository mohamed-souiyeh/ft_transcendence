import NavBar from "./components/navbar";
import SideBar from "./components/sidebar";
import hi from "../assets/hi.svg"
import bot from "../assets/bot.png";
import controllers from "../assets/controllers.png";
import Ranked from "./components/ranked";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";




function Home() {
  const navigate = useNavigate();
  
  const { user, setUser } = useContext(UserContext)
  
  return (
    <>
      <div className="grid justify-center w-screen h-screen bg-gradient-to-br from-purple-sh-2 from-10% via-purple-sh-1 via-30% to-purple ">
        {<SideBar />}
        {<NavBar
        // name={user.profilePicture}
        />}

        <div className="w-[850px] h-[50%]">
          <div className="my-16 bg-purple-sh-2 h-[120px] w-[850px] flex border-4 border-purple-tone-1 rounded-3xl ">
            <div className="grid place-content-center h-100">
              <img className="h-24 w-24 mr-4 ml-2" src={hi} />
            </div>
            <div className="grid place-content-center">
              <div className="flex">
                <h1>Welcome,</h1>
                <h1 className="text-purple">
                  {user.data.username}
                </h1>
              </div>
              <p className="text-2xl"> Pick a game mode and have unlimited fun!!</p>
            </div>
          </div>


          <div className="h-[120px] w-[850px] flex place-content-between">
            <div className="bg-purple w-[400px] h-[120px] rounded-3xl border-[1px] border-purple-tone-1 bg-opacity-30 backdrop-blur-lg flex place-content-between">
              <div onClick={
                () => {
                  navigate("/game");
                }
              } className="">
                <p className="p-2 text-2xl"> Random matching </p>
                <p className="p-2"> In this mode, players will be randomly matched with each other.</p>
              </div>
              <img className="mt-4 mr-4 mb-4 h-[86px] w-[86px]" src={controllers} />
            </div>

            <div className="bg-purple w-[400px] h-[120px] rounded-3xl border-[1px] border-purple-tone-1 bg-opacity-30 backdrop-blur-lg flex place-content-between">
              <div className="">
                <p className="p-2 text-2xl"> Against Bot </p>
                <p className="p-2"> In this mode, players will play against a bot.</p>
              </div>
              <img className="mt-4 mr-4 mb-4 h-[86px] w-[86px]" src={bot} />
            </div>
          </div>

          <p className="mt-12 mb-4 text-purple-tone-1 text-3xl text-opacity-60"> Top players: </p>

        </div>


        <div className=" h-[100%]  w-[850px] rounded-t-xl overflow-hidden">
          <div className="bg-purple-sh-2 h-[100%]  w-[850px] rounded-t-xl overflow-auto scrollbar-thin scrollbar-thumb-purple-sh-1">
            <div className="sticky top-0 w-[830px] flex place-content-between bg-purple-sh-2 bg-opacity-70 backdrop-blur-sm rounded-t-3xl px-28 py-4 z-0" >
              <p className="text-xl text-purple text-opacity-50">Player</p>
              <p className="text-xl text-purple text-opacity-50">Matches</p>
              <p className="text-xl text-purple text-opacity-50">Rank</p>
            </div>
            <Ranked />
            <Ranked />
            {/* we need some data in here, top players and their amount, so we could loop on them, put their names and number of matches they played and render them using a an element i will code later */}
          </div>

        </div>
      </div>
    </>
  )
}

export default Home
