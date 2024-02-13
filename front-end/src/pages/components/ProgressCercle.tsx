
import Progress from 'react-circle-progress-bar';
import React, {useContext } from 'react';

import { UserContext } from "../../App";

export default function ProgressCercle() {
  const gradientStops = [
    { stop: 0.0, color: "#77D970" }, 
    { stop: 1, color: "#77D970" }, 

  ];
  const { user } = useContext(UserContext);
  let val = user.data.score
  return (
    <div className="">
        <div className="ml-20 pr-6 pt-5">
          <Progress
            progress={val * 10 } 
            size={10}
            strokeWidth={10}
            background="#EDE9FB"
            gradient={gradientStops}
            transitionDuration={1}
            subtitle={"Score"}
          />
        </div>
      
    </div>
  );
}