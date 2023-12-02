import NavBar from "./components/navbar";
import SideBar from "./components/sidebar";
import  img  from "../assets/taha.jpg";
import trophy from "../assets/trophy.png";
import star from "../assets/star.png";
import games from "../assets/controller.png"

function Profile () {
  return(
    <>
      <div className="w-screen h-screen grid justify-center">
        <SideBar/>
        <NavBar/>

        <div className="bg-purple bg-opacity-20 backdrop-blur-lg border-[1px] border-purple/20 h-64 mt-20 mb-16 rounded-3xl flex">
          <div className="grid place-content-center">
            <div className="bg-purple-sh-2 m-12 rounded-full h-48 w-48 grid place-content-center ">
              <img className="rounded-full h-44 w-44" src={img} />
            </div>
          </div >
          <div className=" m-6 grid place-content-center">
            <p className="text-2xl m-2"> Nickname </p>
            <p className="text-2xl m-2"> Current level </p>
            <p className="text-2xl m-2"> Rank on server </p>
          </div>
          <div className=" m-6 grid place-content-center">
            <p className="text-2xl m-2">:  Potatoo</p>
            <p className="text-2xl m-2">:  20</p>
            <p className="text-2xl m-2">:  05</p>
          </div>
        </div>

        <div className="h-32 flex place-content-center mb-16">
          <div className="bg-purple bg-opacity-10 border-[1px] border-purple/30 h-44 w-44 mx-8 mt-2 rounded-3xl grid place-content-center hover:bg-opacity-30">
            <div className="grid place-content-center">
              <img className="h-28 w-28 pt-2" src={star} />
            </div>
            <div className="grid place-content-center pt-5">
              <p className="text-xl text-purple-tone-2 text-opacity-50">Achievs</p>
            </div>
          </div>
          <div className="bg-purple bg-opacity-10 backdrop-blur-lg border-[1px] border-purple/30 h-48 w-48 mx-8 rounded-3xl grid place-content-center hover:bg-opacity-30">
            <div className="grid place-content-center">
              <img className="h-28 w-28 pt-2" src={trophy} />
            </div>
            <div className="grid place-content-center pt-9">
              <p className="text-xl text-purple-tone-2 text-opacity-50">Wins</p>
            </div>
          </div>
          <div className="bg-purple bg-opacity-10 border-[1px] border-purple/30 h-44 w-44 mx-8 mt-2 rounded-3xl grid place-content-center hover:bg-opacity-30">
            <img className="h-28 w-28 pt-2" src={games} />
            <div className="grid place-content-center pt-5">
              <p className="text-xl text-purple-tone-2 text-opacity-50">Matchs</p>
            </div>
          </div>
        </div>


        <div className="flex overflow-auto mt-16">

          <div className="grid justify-center">
            <div className="bg-purple-sh-2 h-[100%]  w-[500px] rounded-t-3xl overflow-auto ">
              <div className="sticky top-0 flex place-content-between bg-purple-sh-2 bg-opacity-70 backdrop-blur-sm rounded-t-3xl px-2 py-4 z-0" >
                <p className="text-xl text-purple-tone-2 text-opacity-50">Matchs History:</p>
              </div>
              <p className=" text-2xl text-impure-white text-opacity-50"> Player Vs Player</p> 
              <p className=" text-2xl text-impure-white text-opacity-50"> Player Vs Player</p> 
              <p className=" text-2xl text-impure-white text-opacity-50"> Player Vs Player</p> 
              <p className=" text-2xl text-impure-white text-opacity-50"> Player Vs Player</p> 
              <p className=" text-2xl text-impure-white text-opacity-50"> Player Vs Player</p> 
              <p className=" text-2xl text-impure-white text-opacity-50"> Player Vs Player</p> 
              {/* we need a component for opponents, that will show their name, image, and score from that match*/}
            </div>
          </div>

          <div className="grid justify-center">
            <div className="bg-purple-sh-2 h-[100%]  w-[350px] rounded-t-3xl overflow-auto ml-3">
              <div className="sticky top-0 flex place-content-between bg-purple-sh-2 bg-opacity-70 backdrop-blur-sm rounded-t-3xl px-2 py-4 z-0" >
                <p className="text-xl text-purple-tone-2 text-opacity-50">acheivements:</p>
              </div>
              <p className="text-xl text-purple-tone-2 text-opacity-50">acheivement</p>
              <p className="text-xl text-purple-tone-2 text-opacity-50">acheivement</p>
              <p className="text-xl text-purple-tone-2 text-opacity-50">acheivement</p>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
export default Profile
