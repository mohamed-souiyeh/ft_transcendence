import axios from "axios";
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { networkTabs } from "../chat.enums";

function Icons(props) {

  const [state, setState] = useState(false)
  const menuRef = useRef(null);
  const navigate = useNavigate()

  let { friend, unmount } = props;

  // console.log('friend: ', friend);

  if (!friend) {
    friend = {id: 0, username: 'username'};
  }
  //---------------------------------------------------
  //we need a REAL username to navigate to !!
  const username = friend.username;
  //---------------------------------------------------


  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setState(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [menuRef]);


  const unfriend = () => {
    axios.post('http://localhost:1337/users/unfriend', {id: friend.id}, {
      withCredentials: true
    }).then((res) => {
      if (unmount) {
        unmount(networkTabs.FRIENDS);
      }
      console.log('remove from friends')
    }).catch((err) => {
      console.log('error in removing friend in Icons: ', err);
    });
    // console.log('remove from friends');

  }

  const visitProfile = () => {
    navigate('/'+ username)
    console.log("NOTE: please go to icons.tsx and add a valid username in order to navigate to it.")
    console.log("DONE");
  }

  const blocUser = () => {
    axios.post('http://localhost:1337/users/block', {id: friend.id}, {
      withCredentials: true
    }).then((res) => {
      if (unmount) {
        unmount(networkTabs.FRIENDS);
      }
      console.log('blocki zmar')
    }).catch((err) => {
      console.log('error in blocking user in Icons: ', err);
    });
    
    // console.log('blocki zmar')

  }

  return (
    <div className="flex">
      <div className="px-3 cursor-pointer" onClick={() => console.log('ata7adak fi lo3ba')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
          <path d="M22.695 8.25738C22.4359 7.85385 22.016 7.51121 21.4857 7.27053C20.9554 7.02985 20.3372 6.90134 19.7052 6.90042H16.7317L18.9166 3.15155C19.1118 2.80732 19.1854 2.4352 19.131 2.06681C19.0767 1.69842 18.896 1.34466 18.6045 1.03562C18.2928 0.715464 17.8738 0.453697 17.384 0.273259C16.8943 0.0928214 16.3488 -0.000780465 15.7953 0.00065618H8.66559C7.99172 -0.0106117 7.32921 0.123475 6.76791 0.38473C6.20661 0.645985 5.77369 1.02177 5.52785 1.46111L0.221621 10.6608C0.0316072 11.0043 -0.0377284 11.3748 0.0194486 11.741C0.0766257 12.1073 0.258643 12.4585 0.55018 12.7652C0.861828 13.0854 1.28089 13.3471 1.77065 13.5276C2.26041 13.708 2.80591 13.8016 3.35936 13.8002H7.89347L4.92001 21.5509C4.82095 21.8039 4.84839 22.0729 4.9978 22.3135C5.1472 22.554 5.40957 22.7516 5.74141 22.8734C5.99759 22.9594 6.27873 23.0027 6.56281 22.9999C6.80009 22.9999 7.03457 22.9639 7.2501 22.8944C7.46563 22.825 7.6571 22.7236 7.81133 22.5974L22.2679 10.6723C22.6546 10.338 22.8996 9.93449 22.9751 9.50761C23.0506 9.08074 22.9536 8.64759 22.695 8.25738Z" fill="#8176AF"/>
        </svg>
      </div>
      <div className="cursor-pointer" onClick={() => setState(!state)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="23" viewBox="0 0 8 23" fill="none">
          <path d="M0.820641 2.84711C0.820641 1.27359 2.09352 0 3.66631 0C5.23911 0 6.5127 1.27216 6.5127 2.84711C6.5127 4.41775 5.24126 5.69278 3.66631 5.69278C2.09352 5.69278 0.820641 4.41775 0.820641 2.84711ZM0.820641 11.6474C0.820641 10.0775 2.0928 8.80034 3.66559 8.80034C5.23839 8.80034 6.51198 10.0761 6.51198 11.6474C6.51198 13.2188 5.24054 14.496 3.66559 14.496C2.09351 14.4946 0.820641 13.2188 0.820641 11.6474ZM0.820641 20.155C0.820641 18.5823 2.09352 17.3072 3.66703 17.3072C5.23839 17.3072 6.51198 18.5801 6.51198 20.155C6.51198 21.725 5.24054 23 3.66703 23C2.09352 23 0.820641 21.725 0.820641 20.155Z" fill="#8176AF"/>
          <defs>
            <clipPath id="clip0_1311_182">
              <rect width="23" height="7" fill="white" transform="matrix(0 1 1 0 0.0833359 0)"/>
            </clipPath>
          </defs>
        </svg>
        {state && (  
          <div ref={menuRef} className="z-20 flex flex-col w-32 absolute bg-purple-sh-1 rounded-lg border border-purple-tone-1">
            <div className="flex hover:bg-purple-sh-2 p-2 rounded-t-lg" onClick={() => {unfriend()}}>
              Unfriend
            </div>
            <div className="flex hover:bg-purple-sh-2 p-2" onClick={() => {visitProfile()}}>
              Visit profile
            </div>
            <div className="flex hover:bg-purple-sh-2 p-2 rounded-b-lg" onClick={() => {blocUser()}}>
              Bloc User
            </div>
          </div>
        )
        }
      </div>
    </div>
  )
}

export default Icons
