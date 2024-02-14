import { useState, useEffect } from "react";
import newComerPic from "../../assets/newcomer.png";
import playerPic from "../../assets/player.png";
import veteranPic from "../../assets/veteran.png";
import axios from "axios";
import { useParams } from 'react-router-dom';



export default function Achievements() {
  const [newComer, setNewComer] = useState(false);
  const [player, setPlayer] = useState(false);
  const [veteran, setVeteran] = useState(false);
  const [achievs, setAchievs] = useState([]);
  const { username } = useParams();



  useEffect( () => {
    axios.get(`${process.env.REACT_URL}:1337/users/Public_data/${username}`,
      { withCredentials: true } )
      .then(res => {
        setAchievs(res.data.achievements)
      })
      .catch(()=>{})
  }, [])

  useEffect (() => { 
    achievs.forEach((achievement) => {
      if (achievement.name === "newComer") {
        setNewComer(true);
      } else if (achievement.name === "Player") {
        setPlayer(true);
      } else if (achievement.name === "Veteran") {
        setVeteran(true);
      }
    });
  },[achievs])


  return (
    <div className="h-[100%] w-[350px] rounded-t-3xl">
      <div className="bg-purple-sh-2 h-[100%] w-[350px] rounded-3xl ">
        <div
          title="Played your first game ever"
          className="m-4 h-24 flex justify-start items-center border-b-2 border-purple/15"
        >
          <img
            src={newComerPic}
            className={`h-20 mx-4 ${!newComer && "grayscale-70 opacity-30"}`}
          />
          <p
            className={`text-2xl ${newComer ? "text-impure-white" : "text-white/30"}`}
          >
            New Comer
          </p>
        </div>
        <div
          title="Played 5 matches"
          className="m-4 h-24 flex justify-start items-center border-b-2 border-purple/15"
        >
          <img
            src={playerPic}
            className={`h-20 mx-4 ${!player && "grayscale-70 opacity-30"}`}
          />
          <p
            className={`text-2xl ${player ? "text-impure-white" : "text-white/30"}`}
          >
            Pro Player!
          </p>
        </div>
        <div
          title="Played more than 5 and won 5 matches"
          className="m-4 h-24 flex justify-start items-center border-b-2 border-purple/15"
        >
          <img
            src={veteranPic}
            className={`h-20 mx-4 ${!veteran && "grayscale-70 opacity-30"}`}
          />
          <p
            className={`text-2xl ${veteran ? "text-impure-white" : "text-white/30"}`}
          >
            Veteran!
          </p>
        </div>
      </div>
    </div>
  );
}
