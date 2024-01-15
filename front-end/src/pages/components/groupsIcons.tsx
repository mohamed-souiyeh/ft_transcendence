// import React from 'react'

// function GroupsIcons() {
//   return (
//     <div>

//     </div>
//   )
// }

// export default GroupsIcons

// import React from 'react'

// function GroupsIcons() {
//   return (
//     <div>

//     </div>
//   )
// }

// export default GroupsIcons

// import React from 'react'

// function GroupsIcons() {
//   return (
//     <div>

//     </div>
//   )
// }

// export default GroupsIcons

// import React from 'react'

// function GroupsIcons() {
//   return (
//     <div>

//     </div>
//   )
// }

// export default GroupsIcons

import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { MenuDefault } from "./menuDefault";

function GroupsIcons() {

  const [state, setState] = useState(false)
  const menuRef = useRef(null);
  const navigate = useNavigate()

  //---------------------------------------------------
  //we need a REAL username to navigate to !!
  const username = 'username'
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
    console.log('remove from friends')

  }

  const visitProfile = () => {
    navigate('/'+ username)
    console.log("NOTE: please go to icons.tsx and add a valid username in order to navigate to it.")
  }

  const blocUser = () => {
    console.log('blocki zmar')

  }

  return (
      <MenuDefault/>
  )
}

export default GroupsIcons
