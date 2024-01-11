import Aboutimg from "../../assets/Aboutimg.png"
import { IconButtom } from "./Hero";

export default function About() {
  return (
    <div className="bg-purple-sh-1 w-screen  ml-5w-screen flex justify-between">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="mb-4 lg:mb-0">
          <img
            src={Aboutimg}
            className="ml-5 lg:ml-20 xl:ml-5 rounded-tl-[240px] rounded-br-[240px] rounded-tr-[100px] rounded-bl-[100px] w-full"
          />
        </div>
        <div className="mr-10  lg:-pr-20 xl:pl-10 lg:px-10 lg:me-10">
          <h2 className="lg:text-5xl mb-5 mt-2 font-extrabold text-white">
            ABOUT
          </h2>
          <p className="text-white text-3xl pb-5 tracking-widest ">This Game</p>
          <p className="text-white text-lg font-normal  lg:text-xl">
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
          <button className="mr-5 pt-5">
            <IconButtom val="Watch Video" url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"/>
          </button>
        </div>
      </div>
    </div>
  );
}
