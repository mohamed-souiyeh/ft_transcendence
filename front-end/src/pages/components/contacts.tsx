import Icons from "./icons"
import { useDmContext } from "../../contexts/chatContext.tsx"
import { useEffect, useState } from "react";

function Contacts(props) {

  const { dm, setDm } = useDmContext();
  const [status, setStatus] = useState("online");

  const { user, dmInfo } = props;
  const [img, setImg] = useState('')


  // console.log("this is the user in contacts :", user);

  //NOTE - we need to add the status of the user from the back-end

  const clicked = () => {
    // if (dm.id === dmInfo.id) return;
    setDm({
      ...dmInfo,
      username: user.username,
      userId: user.id,
    })
    console.log("User id ", user.id);
    // console.log("user => ", user);
    // console.log("clicked on the contact");
    // console.log("the user is: ", user);
    // console.log("the dm is: ", dm);
  }

  useEffect(() => {
    setImg(`${process.env.REACT_URL}:1337/users/${user.id}/avatar`);
  }, [])

  return (
    <div className={` ${dm.id === dmInfo.id ? 'bg-purple-sh-0' : 'bg-transparent'} flex border border - transparent border - b - purple - sh - 0 p - 4`} onClick={() => clicked()}>
      <div className='flex basis-11/12 hover:cursor-pointer' >
        <img src={img} className="rounded-full h-12 w-12" />
        <div className="grid px-2">
          <p className="text-xl font-bold text-purple-tone-2"> {user.username} </p>
          <p className="text-sm text-impure-white/40  truncate"> {status} </p>
        </div>
      </div>
      <div className='flex flex-row-reverse basis-1/12 self-center'>
        <Icons user={user} />
      </div>
    </div>
  )
}

export default Contacts
