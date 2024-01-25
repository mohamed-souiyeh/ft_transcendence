import { useContext, useEffect } from "react";
import { useProtectedRoomContext } from "../../contexts/ProtectedRoomContext"
import { UserContext } from "../../App";
import axios from "axios";
import Channels from "./channels";
import Cookies from 'js-cookie';



function Groups(props: any) {



  const { user, setUser } = useContext(UserContext) // global variable
  const { refreshGroups } = props;

  useEffect(() => {
    console.log("hiiiiiiiii", props)
    console.log("user is here", user);
  }, []);

  const { protectedRoom, setProtectedRoom } = useProtectedRoomContext()

  const joinGroup = () => {
    axios.post(
      "http://localhost:1337/conv/join",
      {
        channelId: props.group.id,
        userId: user.data.id,
        password: protectedRoom.password,
      },
      {
        withCredentials: true,
      }
      ).then((response) => {
        console.log("joined channel")
        console.log("response", response);
        console.log("----------------");
    }).catch((error) => {
      console.log("error while joining a group", error);
    });

    //TODO - refresh the user data in context
    axios.get("http://localhost:1337/users/allforhome", {
      withCredentials: true
    })
      .then((resp) => {
        console.log("refreshed the user data: ", resp);
        setUser(prevUser => ({ ...prevUser, data: resp.data }))
        Cookies.set('user', JSON.stringify(resp.data));
      })
      .catch((err) => {
        console.log("error while getting user data in groops", err);
      })
      refreshGroups(true);
    // Handle success, update UI or state if needed
    console.log("Joined channel successfully");
    //  console.log("propos",props);
  }

  const leaveGroup = () => {

    axios.post('http://localhost:1337/conv/leave',
      {
        channelId: props.group.id,
        userId: user.data.id,
      },
      {
        withCredentials: true,
      }).then((response) => {
        console.log("response", response)
      }).catch((error) => {
        console.log("error while leaving a group", error)
      });

    axios.get("http://localhost:1337/users/allforhome", {
      withCredentials: true
    })
      .then((resp) => {
        setUser(prevUser => ({ ...prevUser, data: resp.data }))
        Cookies.set('user', JSON.stringify(resp.data));
      })
      .catch((err) => {
        console.log("error while getting user data in groops", err);
      })
    refreshGroups(true);
    console.log("Leaved channel successfully")
  }

  const setPassword = () => {
    setProtectedRoom({
      state: true,
      password: undefined,
    })
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
        {(user.data.channels.find((channel) => channel.id === props.group.id)) ?
          <button onClick={() => leaveGroup()} className="rounded-lg bg-purple-sh-2 h-10 w-28"> Joined </button> :
          props.group.type === "protected" && protectedRoom.password === undefined ?
            <button onClick={() => setPassword()} className="rounded-lg bg-purple h-10 w-28"> password </button> :
            <button onClick={() => joinGroup()} className="rounded-lg bg-purple h-10 w-28"> Join </button>
        }
      </div>
    </div>
  )
}

export default Groups
