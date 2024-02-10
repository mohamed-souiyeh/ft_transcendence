// import newComerPic from "../../assets/newcomer.png";
// import playerPic from "../../assets/player.png";
// import veteranPic from "../../assets/veteran.png";
// import axios from "axios";
// import React, { useState, useEffect, useContext } from "react";

// const [newComer, setNewComer] = useState(false);
// const [player, setPlayer] = useState(false);
// const [veteran, setVeteran] = useState(false);

// export default function Acheivements() {
//   return (
//     <div className="h-[100%]  w-[350px] rounded-t-3xl overflow-hidden">
//       <div className="bg-purple-sh-2 h-[100%]  w-[350px] rounded-t-3xl overflow-auto scrollbar-thin scrollbar-thumb-purple-sh-1">
//         <div
//           title="Played your first game ever"
//           className="m-4 h-24 flex justify-start items-center border-b-2 border-purple/15"
//         >
//           <img
//             src={newComerPic}
//             className={`h-20 mx-4 ${!newComer && "grayscale-70 opacity-30"} `}
//           />
//           <p
//             className={`text-2xl ${
//               newComer ? "text-impure-white" : "text-white/30"
//             } `}
//           >
//             {" "}
//             New Comer
//           </p>
//         </div>
//         <div
//           title="Played 5 matches"
//           className="m-4 h-24 flex justify-start items-center border-b-2 border-purple/15"
//         >
//           <img
//             src={playerPic}
//             className={`h-20 mx-4 ${!player && "grayscale-70 opacity-30"} `}
//           />
//           <p
//             className={`text-2xl ${
//               player ? "text-impure-white" : "text-white/30"
//             } `}
//           >
//             {" "}
//             Pro Player!
//           </p>
//         </div>
//         <div
//           title="Played more than 5 and won 5 matches"
//           className="m-4 h-24 flex justify-start items-center border-b-2 border-purple/15"
//         >
//           <img
//             src={veteranPic}
//             className={`h-20 mx-4 ${!veteran && "grayscale-70 opacity-30"} `}
//           />
//           <p
//             className={`text-2xl ${
//               veteran ? "text-impure-white" : "text-white/30"
//             } `}
//           >
//             {" "}
//             Veteran!
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }





import React, { useState, useEffect } from "react";
import newComerPic from "../../assets/newcomer.png";
import playerPic from "../../assets/player.png";
import veteranPic from "../../assets/veteran.png";
import axios from "axios";


export default function Achievements() {
  const [newComer, setNewComer] = useState(false);
  const [player, setPlayer] = useState(false);
  const [veteran, setVeteran] = useState(false);

  useEffect(() => {
 
    const checkAchievements = async () => {
     
      // const response = await axios.get(`${process.env.REACT_URL}:1337/users/Public_data/`);
      // const achievements = response.data;
     
      const achievements = { playedFirstGame: true, playedFiveMatches: true, wonFiveMatches: true }; 

      if (achievements.playedFirstGame) {
        setNewComer(true);
      }
      if (achievements.playedFiveMatches) {
        setPlayer(true);
      }
      if (achievements.playedFiveMatches && achievements.wonFiveMatches) {
        setVeteran(true);
      }
    };

    checkAchievements();
  }, []); 

  return (
    <div className="h-[100%] w-[350px] rounded-t-3xl overflow-hidden">
      <div className="bg-purple-sh-2 h-[100%] w-[350px] rounded-t-3xl overflow-auto scrollbar-thin scrollbar-thumb-purple-sh-1">
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
