import { BrowserRouter , Routes, Route} from "react-router-dom";
import SignUp from "./pages/sing_up";
import NotFound from "./pages/not_found";
import Home from "./pages/home";
import Profile from "./pages/profile";
import UserProfile from "./pages/user";
// import Game from "./pages/game";
import LandingPage from "./pages/landingpage";
import Setup from "./pages/userSetup";
// import { apiGlobal } from "./pages/interceptor";


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
    {/* Public Routes */}
          <Route path="/" element={<LandingPage/>} />
          <Route path="/login" element={<SignUp/>} />

    {/* Private Routes */}
          <Route path="/setup" element={<Setup/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/profile" element={<Profile name=""/>} />
          <Route path="/userprofile" element={<UserProfile/>} />
          <Route path="*" element={<NotFound/>} />
          {/* <Route path="/game" element={<Game/>} /> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}
export default App
