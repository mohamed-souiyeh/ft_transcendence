import NavBar from "./components/navbar";
import SideBar from "./components/sidebar";

function Home () {
  return (
    <>
      <div className="w-screen h-screen grid place-content-center ">
        {<SideBar/>}
        {<NavBar/>}
        <h1 className="pl-24"> ain't no place like home </h1>
      </div>
    </>
  )
}

export default Home
