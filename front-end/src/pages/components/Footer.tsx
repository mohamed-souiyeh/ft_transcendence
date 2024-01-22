import { IoLogoGithub } from "react-icons/io";
import { FaFigma } from "react-icons/fa";
import { FaReact } from "react-icons/fa";
import { SiTailwindcss } from "react-icons/si";
import { TbBrandJavascript } from "react-icons/tb";
import { DiNodejs } from "react-icons/di";
import { IconContext } from "react-icons";



export default function Footer() {
  return (
    <div className="bg-purple-sh-1  ml-5 text-center space-y-3 pb-20 ">
      <h2 className="text-white text-2xl" style={{ letterSpacing: '0.2rem' }}>TECHNOLOGIES & SOFTWARES</h2>
      <p className="text-white text-xl">Used in the project</p>
      <div className="flex justify-center space-x-9">
        <IconContext.Provider value={{size:'3rem', color:'white'}}>
          <TbBrandJavascript  />
          <IoLogoGithub  />
          <FaFigma  />
          <FaReact />
          <SiTailwindcss />
          <DiNodejs/>
        </IconContext.Provider>
      </div>
    </div>
  );
}
