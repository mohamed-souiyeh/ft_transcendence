
import Progress from 'react-circle-progress-bar';
import React, {useContext } from 'react';

import { UserContext } from "../../App";

export default function ProgressCercle() {
  const gradientStops = [
    { stop: 0.0, color: "#F8E559" }, 
    { stop: 1, color: "#7b1fa2" }, 
  ];
  const { user } = useContext(UserContext);
  return (
    <div className="">
      <p className="font-semibold	 text-xl tracking-wider text-purple-tone-1 pt-10 ">
        Upgrade Progress
      </p>
      <div className="flex bg-purple-sh-2 border-[2px] border-purple/20 rounded-3xl h-56 w-80 ">
        <div className="mx-auto pt-5">
          <Progress
            progress={user.data.score} 
            size={100}
            strokeWidth={20}
            background="#EDE9FB"
            gradient={gradientStops}
            transitionDuration={1}
            subtitle={"Stay motivated"}
          />
        </div>
      </div>
    </div>
  );
}