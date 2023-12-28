import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const nav = useNavigate();


const AxiosInterceptor =  axios.interceptors.response.use((response) => {

  if (response.status === 401) {
    // Trying to refresh the Token:
    axios.get("http://localhost:1337/auth/refresh", {
      withCredentials: true
    })
      .then(() => {
        console.log("Token refreshed ma nigga!")
      })
      .catch((err) => {
        console.log("my sad shit, an err occured, it's :", err)
        nav('/home')
      })
    console.log("Yoaaaaaaaau are not authorized");
  }
}, (error) => {
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error.message);
  });

export default AxiosInterceptor;






// axios.interceptors.response.use(
//   response => response,
//   async error => {
//     if (error.response.status === 401) {
//     console.log("on ma heaaad oh oh")
//       // -----------
//       // Trying to refresh the Token:
//       axios.get("http://localhost:1337/auth/refresh", {
//         withCredentials: true
//       })
//       .then(() => {
//           console.log("Token refreshed ma nigga!")
//         })
//       .catch((err) => {
//           console.log("my sad shit, an err occured, it's :", err)
//           nav('/home')
//         })
//       // const newToken = await refreshToken();
//       // localStorage.setItem('authToken', newToken);
//       //-------------
//       // Retry the original request
//       return axios(error.config);
//     }
//     console.log("OOOOOOOOOhh~")
//     return Promise.reject(error);
//     //the line above should be modified to kick user out.
//   }
// );


