import { BrowserRouter , Routes, Route} from "react-router-dom";
import Login from "./pages/login";
import SingUp from "./pages/sing_up";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
         <Route path="/login" element={<Login/>} />
         <Route path="/signup" element={<SingUp/>} />
          {
            
            /*
             *  
             *<Route path="/home" element={<Home/>} />
             *  <Route path="/game" element={<Game/>} />
             *  <Route path="/profil" element={<Profile/>} />
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

