import ReactDOM from 'react-dom/client'
import App, { UserContext } from './App.tsx'
import './index.css'
import axios from 'axios'
import Cookies from 'js-cookie'
import { eventBus } from './eventBus.tsx';
import React from 'react'
import { AvatarProvider } from './contexts/avatar.tsx'
import { NotificationProvider } from './contexts/notificationContext.tsx'



axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;


    console.log("response interceptor :", error.response);
    console.log("original config :", error.config);
    const isRefreshRequest = error.request.responseURL === `${process.env.REACT_URL}:1337/auth/refresh`;

    if (isRefreshRequest) {
      // console.log("isRefreshRequest :", isRefreshRequest);
      return Promise.reject(error);
    }

    // if (error.response && error.response.status === 403 ) {

    // }


    // console.log("isRefreshRequest :", isRefreshRequest);
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Trying to refresh the Token:
      console.log("Trying to refresh Token..")
      return axios.get(`${process.env.REACT_URL}:1337/auth/refresh`, {
        withCredentials: true
      }).then(() => {
          console.log("Token refreshed ma nigga!")
          //FIXME - this bastard is mostlikly is the root of the problem
          return axios(originalRequest);
        }).catch((err) => {
          console.log("my sad shit, an err occured, it's :", err);

          eventBus.emit('unauthorized');
          return Promise.reject(error);
        })
    }
    return Promise.reject(error);
  }
);




ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode> 

  <AvatarProvider>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </AvatarProvider>
  // </React.StrictMode>
)
