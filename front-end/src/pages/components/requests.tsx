import axios from 'axios';
import { networkTabs } from '../chat.enums';
import { useEffect, useState } from 'react';

function Requests(props) {
  const { request, unmount } = props;

  const sender = request.sender;

  const acceptRequest = () => {
    axios.post(`${process.env.REACT_URL}:1337/notifications/friend-request/accept`, request, {
      withCredentials: true,
    }).then(() => {
      console.log("friend request accepted");
      unmount(networkTabs.REQUESTS);
    }).catch((err) => {
      console.log("error in accepting friend request", err);
    });
  };

  const declineRequest = () => {
    axios.post(`${process.env.REACT_URL}:1337/notifications/friend-request/refuse`, request, {
      withCredentials: true,
    }).then(() => {
      console.log("friend request declined");
      unmount(networkTabs.REQUESTS);
    }).catch(() => {
      console.log("error in accepting friend request")
    });
  };

  const blockUser = () => {
    axios.post(`${process.env.REACT_URL}:1337/notifications/friend-request/block`, request, {
      withCredentials: true,
    }).then(() => {
      console.log("friend request blocked");
      unmount(networkTabs.REQUESTS);
    }).catch(() => {
      console.log("error in accepting friend request")
    });
  };

  const [img, setImg] = useState('')

  useEffect(() => {
    setImg(`${process.env.REACT_URL}:1337/users/${props.id}/avatar`);
  }, [])

  return (
    <div className='flex border border-transparent border-b-purple-sh-0 mx-14 py-3 '>
      <div className='flex place-items-center basis-1/2' >
        <img src={img} className='rounded-full h-12 w-12' />
        <p className='text-lg px-7' > {sender.username} </p>
      </div>
      <div className='flex flex-row-reverse  place-items-center basis-1/2' >
        {/* bc we gon call those two icons tgther so much, i will make a component for it */}
        <div className="pt-1 cursor-pointer" onClick={blockUser}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M0 11.9999C0 18.6167 5.38318 23.9999 11.9999 23.9999C18.6167 23.9999 23.9999 18.6167 23.9999 11.9999C23.9999 5.38318 18.6168 0 11.9999 0C5.38306 0 0 5.38318 0 11.9999ZM19.7522 11.9999C19.7522 16.2746 16.2746 19.7522 11.9999 19.7522C10.633 19.7522 9.34838 19.3953 8.23203 18.7717L18.7716 8.23203C19.3952 9.34838 19.7522 10.633 19.7522 11.9999ZM11.9999 4.24777C13.3669 4.24777 14.6515 4.60471 15.7679 5.2283L5.22841 15.768C4.60471 14.6516 4.24777 13.367 4.24777 11.9999C4.24777 7.72533 7.72533 4.24777 11.9999 4.24777Z" fill="#8176AF" />
            <defs>
              <clipPath id="clip0_1430_53">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className="pt-1 px-3 cursor-pointer" onClick={declineRequest}>
          <svg xmlns="http://www.w3.org/2000/svg" width="23" height="22" viewBox="0 0 23 22" fill="none">
            <path d="M2.06194 1.18439L2.06183 1.18449C1.62362 1.62284 1.37744 2.21729 1.37744 2.83711C1.37744 3.45693 1.62362 4.05137 2.06183 4.48972L2.06188 4.48977L8.20573 10.6336L2.06188 16.7775L2.06183 16.7774L2.05579 16.7837C1.63 17.2245 1.39439 17.815 1.39972 18.4279C1.40504 19.0407 1.65087 19.627 2.08427 20.0604C2.51766 20.4938 3.10393 20.7396 3.71682 20.745C4.3297 20.7503 4.92016 20.5147 5.36102 20.0889L5.36107 20.0889L5.36722 20.0828L11.5111 13.939L17.6549 20.0828L17.6549 20.0829L17.6611 20.0889C18.102 20.5147 18.6924 20.7503 19.3053 20.745C19.9182 20.7396 20.5045 20.4938 20.9379 20.0604C21.3712 19.627 21.6171 19.0407 21.6224 18.4279C21.6277 17.815 21.3921 17.2245 20.9663 16.7837L20.9664 16.7836L20.9602 16.7775L14.8164 10.6336L20.9602 4.48977L20.9603 4.48983L20.9663 4.48358C21.3921 4.04272 21.6277 3.45226 21.6224 2.83938C21.6171 2.22649 21.3712 1.64022 20.9379 1.20683C20.5045 0.773433 19.9182 0.527601 19.3053 0.522275C18.6924 0.51695 18.102 0.752557 17.6611 1.17835L17.6611 1.1783L17.6549 1.18444L11.5111 7.32829L5.36722 1.18444L5.36716 1.18439C4.92882 0.746174 4.33437 0.5 3.71455 0.5C3.09473 0.5 2.50028 0.746175 2.06194 1.18439Z" fill="#8176AF" stroke="#8176AF" />
          </svg>

        </div>
        <div className="pt-1 cursor-pointer" onClick={acceptRequest}>
          <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
            <path d="M21.4048 4.30309L21.3995 4.30961L21.3943 4.31621L10.6264 18.0134L6.12787 12.697C5.95133 12.4813 5.73405 12.3025 5.4884 12.1706C5.23894 12.0367 4.96524 11.9541 4.68337 11.9274C4.40151 11.9008 4.11717 11.9308 3.84705 12.0156C3.57693 12.1004 3.32648 12.2383 3.1104 12.4212C2.89433 12.6042 2.71699 12.8284 2.5888 13.0809C2.46061 13.3333 2.38416 13.6088 2.36393 13.8912C2.34371 14.1736 2.38012 14.4572 2.47102 14.7253C2.5605 14.9892 2.70101 15.2329 2.8845 15.4426L8.62024 22.2212L8.62038 22.2214C8.87796 22.5256 9.20001 22.7688 9.56318 22.9332C9.92636 23.0976 10.3216 23.1792 10.7202 23.172C11.1188 23.1648 11.5108 23.069 11.8678 22.8916C12.2248 22.7141 12.5378 22.4595 12.7842 22.1461L12.7843 22.146L24.7352 6.94274L24.7403 6.93621L24.7453 6.92959C25.0825 6.48569 25.2317 5.92708 25.1609 5.37417C25.09 4.82127 24.8047 4.31834 24.3665 3.97381C23.9284 3.62927 23.3723 3.47071 22.8183 3.5323C22.2643 3.5939 21.7567 3.87072 21.4048 4.30309Z" fill="#8176AF" stroke="#8176AF" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  )
}


export default Requests
