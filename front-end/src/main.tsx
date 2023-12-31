import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import axios from 'axios'


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
