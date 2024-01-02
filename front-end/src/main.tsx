import ReactDOM from 'react-dom/client'
import App, { UserContext } from './App.tsx'
import './index.css'
import axios from 'axios'
import Cookies from 'js-cookie'


axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Trying to refresh the Token:
        console.log("Trying to refresh Token..")
        await axios.get("http://localhost:1337/auth/refresh", {
          withCredentials: true
        })
        .then(() => {
          console.log("Token refreshed ma nigga!")
        })
        .catch((err) => {
          console.log("my sad shit, an err occured, it's :", err)
        })

        // retrying the req
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        //here, we should logout the user.

        axios.get("http://localhost:1337/auth/logout", {
          withCredentials: true
        })
          .then((resp) => {
            if (resp.status == 200){
              console.log("user successfully logged out")
            }
          })
          .catch( (err) => {
            console.log("there's nowhere to run", err)
          })

        Cookies.remove('user')
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);




ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode> 
  <App />
  // </React.StrictMode>
)
