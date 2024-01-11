
import pong from "../assets/pong.png";

function IconButtom({ val , url}: { val: string , url: string}) {
  return (
    <a  target="_blank"  href={url}  className="relative inline-flex items-center justify-center p-4 px-8 md:px-20 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-purple rounded-full shadow-md group">
      <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-purple group-hover:translate-x-0 ease">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          ></path>
        </svg>
      </span>
      <span className="absolute flex items-center justify-center w-full h-full text-purple-tone-1 transition-all duration-300 transform group-hover:translate-x-full ease">
        {val}
      </span>
      <span className="relative invisible ">{val}</span>
    </a>
  );
}

export default function Hero() {
  return (
    <div className="bg-purple-sh-1 w-full ml-auto">
      <div className="md:flex justify-end ml-4 pt-10">
        <div className="md:w-1/2 md:text-left">
          <h1 className="mb-4 text-3xl font-extrabold text-white dark:text-white md:text-5xl lg:text-6xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-purple from-violet-300">
              Dive Into The Most
              <br />
            </span>{" "}
            Exciting Pong Game.
          </h1>
          <p className="text-lg font-normal text-white lg:text-xl pb-5">
            Ready to serve up an epic win? <br />
            Dive into our new web game - a ping pong frenzy crafted by
            passionate players just like you. <br />
            Experience the thrill of the rally, perfected through teamwork and
            dedication. It's game, set, matchless.
          </p>

          <button className="mr-5">
            <IconButtom val="Play Now" url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"/>
          </button>
        </div>
        <div className="md:w-1/2">
          <img
            src={pong}
            className="h-auto ms-auto -mt-10 animate-trans-right"
            alt="Pong Game Image"
          />
        </div>
      </div>
    </div>
  );
}

export { IconButtom };
