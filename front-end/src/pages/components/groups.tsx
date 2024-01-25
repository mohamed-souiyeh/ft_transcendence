import { useContext, useEffect } from "react";
import { useProtectedRoomContext} from "../../contexts/ProtectedRoomContext"
import { UserContext } from "../../App";
import axios from "axios";
import Channels from "./channels";



function Groups(props) {
 


  const {user , setUser} = useContext(UserContext) // global variable


  useEffect(() => {  
    console.log("hiiiiiiiii" , props) 
    console.log("user is here" , user);
  }, [] );
  const {setProtectedRoom } = useProtectedRoomContext()

  const joinGroup = () => {
    if (props.group.type === "protected")
      setProtectedRoom(true)
    else
    {
      const response = axios.delete(
          "http://localhost:1337/conv/join",
          {
            channelId: props.group.id,
            userId: user.data.id,
          }
        );
  
        // Handle success, update UI or state if needed
        console.log("Joined channel successfully");
      //  console.log("propos",props);
    }
  

  }

  const leaveGroup = () => {

    const response = axios.delete('http://localhost:1337/conv/leave', {
      data: {
        channelId: props.group.id,
        userId: user.data.id,
      },
    });
    console.log("Leaved channel successfully")
  }

  return (
    <div className='flex bg-purple-sh-1 my-2 mx-3 rounded-lg'>
      <div className='basis-2/3 m-2'>
        <div className='grid'>
          <p className='text-xl pl-3 pt-2'> {props.group.channelName} </p>
          <p className='text-sm pl-3 pb-2 pt-1 text-impure-white/40'> {props.group.type} </p>
        </div>
      </div>
      <div className='flex flex-row-reverse m-3 basis-1/3 items-center'>
        { (user.data.channels.find((channel) => channel.id === props.group.id)) ? 
         <button onClick={() => leaveGroup()} className="rounded-lg bg-purple-sh-2 h-10 w-28"> Joined </button> : 
        <button onClick={() => joinGroup()} className="rounded-lg bg-purple h-10 w-28"> Join </button>
        }
      </div>
    </div>
  )
}

export default Groups
