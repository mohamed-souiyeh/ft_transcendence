import axios from 'axios';
import Icons from './icons'
import { useDmContext } from '../../contexts/chatContext';
import { useEffect, useState } from 'react';

function Friends(props) {
  const { friend, unmount, refreshDms } = props;
  const {dm, setDm } = useDmContext();
  const [img, setImg] = useState('')

  useEffect( ()=> {
    setImg(`${process.env.REACT_URL}:1337/users/${props.id}/avatar`);
  },[])

  const handleChat = () => {
    axios.post(`${process.env.REACT_URL}:1337/conv/createDM`, friend, {
      withCredentials: true,
      }).then((res) => {
        refreshDms(true);
        console.log("dm created");
        console.log("dm is: ", res.data);

        setDm(res.data)
      }).catch((err) => {
        console.log("error in creating dm: ", err);
      });
  };

  return (
    <div className='flex border border-transparent border-b-purple-sh-0 mx-14 py-3'>
      <div className='flex place-items-center basis-1/2' >
        <img src={img} className='rounded-full h-12 w-12' />
        <div className="grid">
        <p className='text-lg px-7 font-bold' > {friend.username} </p>
        <p className='text-sm text-purple-tone-2/70 px-7' > {friend.status} </p>
      </div>
      </div>
      <div className='flex flex-row-reverse  place-items-center basis-1/2' >
        {/* bc we gon call those two icons tgther so much, i will make a component for it */}

        <Icons user={friend} unmount={unmount}/> 
        <div className="pl-3 cursor-pointer" onClick={() => handleChat()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="23" viewBox="0 0 22 23" fill="none">
            <path d="M2.875 0.958252C1.28719 0.958252 0 2.24544 0 3.83325V14.3749C0 15.9628 1.28719 17.2499 2.875 17.2499H4.79167V21.0833C4.79167 21.4551 5.00677 21.7934 5.34351 21.9511C5.68026 22.1089 6.07785 22.0575 6.36351 21.8194L11.8469 17.2499H18.2083C19.7962 17.2499 21.0833 15.9628 21.0833 14.3749V3.83325C21.0833 2.24544 19.7962 0.958252 18.2083 0.958252H2.875Z" fill="#8176AF"/>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Friends
