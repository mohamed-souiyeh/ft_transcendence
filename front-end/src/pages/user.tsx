import SideBar from "./components/sidebar";
import NavBar from "./components/navbar";
import UserInfo from "./components/UserInfo";
import Acheivements from "./components/Acheivements";
import GameHistory from "./components/GameHistory";

function UserProfile() {
  return (
    <div className="overflow-hidden relative w-full ">
      <div className="w-screen h-screen bg-purple-sh-1 from-purple-sh-2 via-purple-sh-1 to-purple overflow-auto scrollbar-thin scrollbar-thumb-purple-sh-1">
        {<SideBar />}
        {<NavBar />}
        <div className="grid mt-10 md:mt-20 mx-auto w-80 md:h-auto md:w-10/12 lg:w-6/12">
          <UserInfo />
          <div className="flex space-x-72 mt-20">
            <p className=" font-semibold text-xl tracking-wider text-purple-tone-1 pt-4 md:pt-10 ml-6 ">
              Achievements
            </p>
            <p className=" font-semibold text-xl tracking-wider text-purple-tone-1 pt-4 md:pt-10 ml-4 ">
              Game History
            </p>
          </div>

          <div className="flex mt-auto justify-center ">
            {<Acheivements />}
            {<GameHistory />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
