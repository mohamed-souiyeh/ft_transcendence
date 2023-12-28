import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import axios from 'axios'



axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response.status === 401) {
      console.log("on ma heaaad oh oh")
      // -----------
      // Trying to refresh the Token:
      axios.get("http://localhost:1337/auth/refresh", {
        withCredentials: true
      })
        .then(() => {
          console.log("Token refreshed ma nigga!")
        })
        .catch((err) => {
          console.log("my sad shit, an err occured, it's :", err)
        })
      //-------------
      // Retry the original request
      return axios(error.config);
    }
    return Promise.reject(error);
    //the line above should be modified to kick user out.
  }
);



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
