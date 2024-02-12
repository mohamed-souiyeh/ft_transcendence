import History from "./history";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function GameHistory() {
  const [history, setHistoty] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_URL}:1337/users/Public_data/${username}`, {
        withCredentials: true,
      })
      .then((res) => {
        setHistoty(res.data.allMatches);
        console.log("eeee: ", res.data.achievements);
      })
      .catch(() => {
        console.log("Error getting matches history!!");
      });
  }, []);
  return (
    <>
        
      <div className="ml-14 flex overflow-hidden">
        <div className="grid justify-center mx-5 ">
          <div className="h-[100%]  w-[500px] rounded-t-3xl overflow-hidden">
            <div className="bg-purple-sh-2 h-[100%]  w-[500px] rounded-t-3xl overflow-auto scrollbar-thin scrollbar-thumb-purple-sh-1 ">
              {history.length ? (
                history.map((matches) => (
                  <History key={matches.id} data={matches} />
                ))
              ) : (
                <p className="text-xl text-purple/50 p-5">
                  {" "}
                  No history made yet{" "}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
