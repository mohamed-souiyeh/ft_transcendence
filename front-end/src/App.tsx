import { BrowserRouter , Routes, Route} from "react-router-dom";
import Login from "./pages/login";
import SingUp from "./pages/sing_up";
import NotFound from "./pages/not_found";
import Home from "./pages/home";
import Profile from "./pages/profile";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<SingUp/>} />
          <Route path="/home" element={<Home/>}/>
          <Route path="/profile" element={<Profile/>} />
          <Route path="*" element={<NotFound/>} />
          {

            /*
             *  
             *  <Route path="/game" element={<Game/>} />
             *   <Route path="/userprofile" element={<UserProfile/>} /> an id should be added later, or smth to keep each profile special or the nickname..
             */
          }
        </Routes>
      </BrowserRouter>
    </>
  )
}
export default App



// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//       </Routes>
//     </Router>
//   );
// }

