import axios from 'axios';
import { networkTabs } from '../chat.enums';
import { useEffect, useState } from 'react';

function Blocked(props) {
  const { blocked, unmount } = props;
  const [img, setImg] = useState('')
  const [status, setStatus] = useState("online");

  useEffect(() => {
    setImg(`${process.env.REACT_URL}:1337/users/${props.id}/avatar`);
    axios.get(`${process.env.REACT_URL}:1337/users/status/${props.id}`,
      {
        withCredentials: true,
      }).then((res) => {
        console.log("the status: ", res.data);
        setStatus(res.data);
      }).catch(() => { })
  }, [])

  const UnblockUser = () => {
    axios.post(`${process.env.REACT_URL}:1337/users/unblock`, blocked, {
      withCredentials: true,
    })
      .then(() => {
        unmount(networkTabs.BLOCKED);
      })
      .catch(() => { });
  };

  return (
    <div className='flex border border-transparent border-b-purple-sh-0 mx-14 py-3 '>
      <div className='flex place-items-center basis-1/2' >
        <img src={img} className='rounded-full h-12 w-12' />
        <p className='text-lg px-7' > {blocked.username} </p>
        <p className='text-lg px-7' > {status} </p>
      </div>
      <div className='flex flex-row-reverse  place-items-center basis-1/2' >
        <button className="rounded-lg bg-purple-sh-0 focus:outline-none border-none hover:bg-purple text-sm" onClick={UnblockUser}>Unblock</button>
      </div>
    </div>
  )
}

export default Blocked
