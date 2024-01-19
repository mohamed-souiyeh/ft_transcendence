import a3 from "../../assets/a3.png";
import star from "../../assets/star.png";
import trophy from "../../assets/trophy.png";
import a4 from "../../assets/a4.png";
import a2 from "../../assets/a2.png";
import a7 from "../../assets/a7.png";

export default function Acheivements() {
  return (
    <div className="flex flex-row overflow-x-scroll p-4 h-56 bg-purple-sh-2 border-[2px] border-purple/20 rounded-3xl">
      <div className=" flex-shrink-0 bg-purple bg-opacity-30 border-[2px] border-purple/20 rounded-3xl h-44 w-44 my-auto mr-3">
        <img src={star} className=" size-36 pt-3 mx-auto " />
        <p className="text-center font-semibold text-xl text-impure-white">
          Active member
        </p>
      </div>

      <div className=" flex-shrink-0 bg-purple bg-opacity-30 border-[2px] border-purple/20 rounded-3xl h-44 w-44 my-auto mr-3">
        <img src={trophy} className=" size-36 pt-3 mx-auto " />
        <p className="text-center font-semibold text-xl text-impure-white">
          Won Bot
        </p>
      </div>
     
      <div className=" flex-shrink-0 bg-purple bg-opacity-30 border-[2px] border-purple/20 rounded-3xl h-44 w-44 my-auto mr-3">
        <img src={a4} className=" size-36 pt-3 mx-auto " />
        <p className="text-center font-semibold text-xl text-impure-white">
          Won Bot
        </p>
      </div>
      <div className=" flex-shrink-0 bg-purple bg-opacity-30 border-[2px] border-purple/20 rounded-3xl h-44 w-44 my-auto mr-3">
        <img src={a7} className=" size-36 pt-3 mx-auto " />
        <p className="text-center font-semibold text-xl text-impure-white">
          Ranked Top 1
        </p>
      </div>
      <div className=" flex-shrink-0 bg-purple bg-opacity-30 border-[2px] border-purple/20 rounded-3xl h-44 w-44 my-auto mr-3">
        <img src={a2} className=" size-36 pt-3 mx-auto " />
        <p className="text-center font-semibold text-xl text-impure-white">
          Active Member
        </p>
      </div>
      <div className=" flex-shrink-0 bg-purple bg-opacity-30 border-[2px] border-purple/20 rounded-3xl h-44 w-44 my-auto mr-3">
        <img src={a3} className=" size-36 pt-3 mx-auto " />
        <p className="text-center font-semibold text-xl text-impure-white">
          Active Member
        </p>
      </div>
    </div>
  );
}
