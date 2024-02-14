import Progress from 'react-circle-progress-bar';


export function ProgressCercle(userData:any) {
  const gradientStops = [
    { stop: 0.0, color: "#77D970" }, 
    { stop: 1, color: "#77D970" }, 

  ];
  const score = userData.userData.score;
  const max = 100;

  return (
    <div className="">
      <div className="ml-20 pr-6 pt-5">
        <Progress
          progress={((score * 100) / max) > max ? 101: ((score * 100) / max)} 
          size={max}
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
