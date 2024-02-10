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
        <div className="grid mt-10 md:mt-20 mx-auto md:h-auto md:w-10/12 lg:w-8/12">
          <UserInfo />
          <p className="font-semibold text-xl tracking-wider text-purple-tone-1 pt-4 md:pt-10 ml-2 ">
            Achievements
          </p>
          <div className="flex mt-auto">
            {<Acheivements />}
            {<GameHistory />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
