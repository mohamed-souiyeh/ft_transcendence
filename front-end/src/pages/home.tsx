import NavBar from "./components/navbar";
import SideBar from "./components/sidebar";

function Home () {
  return (
  <>
      {<SideBar/>}
      {<NavBar/>}
    <h1 className="pl-24"> ain't no place like home </h1>
  </>
  )
}

export default Home
