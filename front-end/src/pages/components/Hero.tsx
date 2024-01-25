import { useNavigate } from "react-router-dom";
import pong from "../../assets/pong.png";


function IconButtom({ val , url}: { val: string , url: string}) {
  return (
    <a  target="_blank"  href={url}  className="relative inline-flex items-center justify-center p-4 px-20 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-purple rounded-full shadow-md group">
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

  const navigate = useNavigate()

  return (

    <div className="flex m-10">
      <div className="flex basis-1/2">
        <div className="grid"> 

          <div className="flex h-10 pl-5"> 
            <p className="text-purple text-7xl font-extrabold p-0 mb-0 mr-3"> Dive </p>
            <p className="text-7xl font-extrabold">  Into The Most </p>
          </div>
          <div className="flex pl-5"> 
            <p className="text-7xl font-extrabold">  Exciting </p>
            <p className="text-purple text-7xl font-extrabold ml-3">  Pong Game. </p>
          </div>

          <p className="text-justify text-lg pl-5 h-20"> 
            Ready to serve up an epic win? <br /> 
            Dive into our new web game - a ping pong crafted by 
            passionate players just like you. <br /> 
            Experience the thrill of the rally, perfected through teamwork and 
            dedication.
          </p>

          <div className="flex h-10"> 
            <button className="mr-5" onClick={() => {navigate("/home")}}> 
              <IconButtom val="Play Now" /> 
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-row-reverse basis-1/2 mr-10">
        <img 
          src={pong} 
          className="h-auto ms-auto -mt-10 animate-trans-right" 
          alt="Pong Game Image" 
        /> 
      </div>

    </div>

  );
}

export { IconButtom };
