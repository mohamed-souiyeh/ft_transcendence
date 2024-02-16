import { useContext, useEffect, useState } from "react";
import { useProtectedRoomContext } from "../../contexts/ProtectedRoomContext"
import { UserContext } from "../../App";
import axios from "axios";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";



function Groups(props: any) {
  const { user, setUser } = useContext(UserContext)
  const { refreshGroups } = props;
  const [incorrectPassword, setIncorrectPassword] = useState("");

  useEffect(() => {
    setIncorrectPassword("");
  }, []);

  const { protectedRoom, setProtectedRoom } = useProtectedRoomContext()

  // useEffect(() => {
  //   if (protectedRoom.state === true && protectedRoom.password !== undefined) {
  //     joinGroup();
  //   }
  // }, [protectedRoom])



  const joinGroup = () => {
    axios.post(
      `${process.env.REACT_URL}:1337/conv/join`,
      {
        channelId: props.group.id,
        userId: user.data.id,
        password: protectedRoom.password,
      },
      {
        withCredentials: true,
      }
    ).then(() => {
        setProtectedRoom({
          state: false,
          password: undefined,
        })
        setIncorrectPassword("");
        axios.get(`${process.env.REACT_URL}:1337/users/allforhome`, {
          withCredentials: true
        })
          .then((resp) => {
            setUser(prevUser => ({ ...prevUser, data: resp.data }))
            Cookies.set('user', JSON.stringify(resp.data), { sameSite: 'strict', secure: true });
            refreshGroups(true);
          })
          .catch(() => {})

        toast(`Group Joined`, {
          pauseOnHover: false,
          pauseOnFocusLoss: false
        });
      })
      .catch((error) => {
        setIncorrectPassword(error.response.data.message);
        setProtectedRoom({
          state: false,
          password: undefined,
        });
      });

    // Handle success, update UI or state if needed
  }

  const leaveGroup = () => {

    axios.post(`${process.env.REACT_URL}:1337/conv/leave`,
      {
        channelId: props.group.id,
        userId: user.data.id,
      },
      {
        withCredentials: true,
      }).then(() => {
        axios.get(`${process.env.REACT_URL}:1337/users/allforhome`, {
          withCredentials: true
        })
          .then((resp) => {
            setUser(prevUser => ({ ...prevUser, data: resp.data }))
            Cookies.set('user', JSON.stringify(resp.data), { sameSite: 'lax'   });
            refreshGroups(true);
          })
          .catch(() => {})
      
        toast(`You left the group, Sayonara`, {
          pauseOnHover: false,
          pauseOnFocusLoss: false
        });
      }).catch(() => {});

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
          <div className="flex flex-row gap-1 items-center">
            <p className='text-sm pl-3 pb-2 pt-1 text-impure-white/40'> {props.group.type} </p>
            <span className=' text-red-700 text-base'>{incorrectPassword}</span>
          </div>
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
