import { useNavigate } from "react-router-dom";
import Aboutimg from "../../assets/Aboutimg.png"
import { IconButtom } from "./Hero";

export default function About() {

  const navigate = useNavigate()

  return (
    <div className="flex m-10">
      <div className="basis-1/2 mb-4 lg:mb-0">
        <img
          src={Aboutimg}
          className="ml-5 lg:ml-20 xl:ml-5 rounded-tl-[240px] rounded-br-[240px] rounded-tr-[100px] rounded-bl-[100px] w-[700px]"
        />
      </div>
      <div className="flex-col-reverse basis-1/2 ml-5">
        <div className="grid p-12">
          <h2 className="lg:text-5xl  mt-2 font-extrabold text-white">
            ABOUT
          </h2>
          <p className="text-white text-3xl pb-5 tracking-widest ">This Game</p>
          <p className="text-lg text-justify">
            As simple as a <strong>Pong game</strong> could look, as complicated
            its building was, some of the challenges involved on the side of the
            game itself are: Physics, collision detection,networking and many
            more.
            <br />
            The project doesn’t consist of the game alone; there are two other
            wide worlds which are the front-end and the back-end and we needed
            to carefully work on both of them in order to bring all the features
            into life so the players will have their own profile can join chat
            groups, invite their friends and a great deal more.
          </p>
          <div className="flex mt-8"> 
            <button className=" p-0 m-0 " onClick={() => {navigate("/home")}}> 
              <IconButtom val="Play Now" /> 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
