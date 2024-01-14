import SideBar from "./components/sidebar";
import NavBar from "./components/navbar";

function UserProfile() {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-sh-2 from-10% via-purple-sh-1 via-30% to-purple ">
      {<SideBar />}
      {
        <NavBar
        // name={user.profilePicture}
        />
      }
    </div>
  );
}
export default UserProfile;
