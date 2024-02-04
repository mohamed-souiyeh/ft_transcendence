import NavBar from "./components/navbar";
import SideBar from "./components/sidebar";
import hi from "../assets/hi.svg"
import bot from "../assets/bot.png";
import controllers from "../assets/controllers.png";
import Ranked from "./components/ranked";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import axios from "axios";
// <<<<<<< HEAD
// import axios from "axios";
// import { useAvatarContext } from "../contexts/avatar";




function Home() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext)
  const [topPlayers, setTopPlayers] = useState([])

  // =======
  // import { ToastContainer, toast } from "react-toastify";
  // import { SocketContext } from "../clientSocket";

  // function Home() {
  //   const navigate = useNavigate();
  //   
  //   const { user, setUser } = useContext(UserContext);
  //   const game_socket = useContext(SocketContext);

  // >>>>>>> master

  useEffect( () => {

    axios.get(`${process.env.REACT_URL}:1337/users/leaderboard`, {
      withCredentials: true
    })
      .then((resp) => {
        console.log("leaderboard:", resp.data)
        setTopPlayers(resp.data)
      })
      .catch(()=> {
        console.log("OOOooopsss!")
      })
  },[])


  return (
    <>
      <div className="grid justify-center w-screen h-screen bg-gradient-to-br from-purple-sh-2 from-10% via-purple-sh-1 via-30% to-purple ">
        {<SideBar />}
        {<NavBar />}

        <div className="w-[850px] h-[40%]">
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


          <div className="h-[120px] w-[850px] flex place-content-between mt-6">
            <div 
              onClick={
                () => {
                  // game_socket.emit("queuing");
                  navigate("/game");
                }
              } 
              style={{
                cursor: "pointer" ,
                transition: "all 0.5s ease"}}
              className="group bg-purple w-[400px] h-[120px] rounded-3xl 
                border-[1px] border-purple-tone-1 bg-opacity-30 
                backdrop-blur-lg flex place-content-between 
                hover:w-[420px] hover:h-[130px]">
              <div>
                <p className="p-3 text-2xl"> Random matching </p>
                <p className="opacity-0 group-hover:opacity-100 transition-opacity p-3"> Play with real players online.</p>
              </div>
              <img className="mt-4 mr-4 mb-4 h-[86px] w-[86px]" src={controllers} />
            </div>

            <div 
              style={{
                cursor: "pointer",
                transition: "all 0.5s ease"
              }}
              className="group bg-purple w-[400px] h-[120px] rounded-3xl 
                border-[1px] border-purple-tone-1 bg-opacity-30 
                backdrop-blur-lg flex place-content-between 
                hover:w-[420px] hover:h-[130px]"
              onClick={() => navigate("/bot")}
            >
              <div>
                <p className="p-3 text-2xl"> Against Bot </p>
                <p className="opacity-0 group-hover:opacity-100 transition-opacity p-3">
                Game tutorial, learn how to play</p>
              </div>
              <img className="mt-4 mr-4 mb-4 h-[86px] w-[86px]" src={bot} />
            </div>
          </div>
        </div>


        <div className="h-[100%]  w-[850px] rounded-t-xl overflow-hidden">
        <p className="mb-2  text-purple-tone-1 text-3xl text-opacity-60"> Top players: </p>
          <div className="bg-purple-sh-2 h-[100%]  w-[850px] rounded-t-xl overflow-auto scrollbar-thin scrollbar-thumb-purple-sh-1">
            <div className="sticky top-0 w-[830px] flex place-content-between bg-purple-sh-2 bg-opacity-70 backdrop-blur-sm rounded-t-3xl px-28 py-4 z-0" >
              <p className="text-xl text-purple text-opacity-50">Player</p>
              <p className="text-xl text-purple text-opacity-50">Matches</p>
              <p className="text-xl text-purple text-opacity-50">Score</p>
            </div>
              {topPlayers.length ? topPlayers.map((player) => <Ranked name={player.username} key={player.id}  id={player.id} matchesPlayed={player.matchesPlayed} score={player.score} />) : <p className="text-xl text-purple/50 p-5"> no Ranking yet</p>}
          </div>

        </div>
      </div>
    </>
  )
}

export default Home
