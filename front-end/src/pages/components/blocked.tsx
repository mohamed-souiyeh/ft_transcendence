import axios from 'axios';
import img from '../../assets/taha.jpg'
import { networkTabs } from '../chat.enums';

function Blocked(props) {
  const { blocked, unmount } = props;

  console.log("blocked is: ", blocked);

  const UnblockUser = () => {
    axios.post(`${process.env.REACT_URL}:1337/users/unblock`, blocked, {
      withCredentials: true,
    }).then(() => {
      console.log("user unblocked");
      unmount(networkTabs.BLOCKED);
    }).catch(() => {
      console.log("error in unblocking user")
    });
  };

  return (
    <div className='flex border border-transparent border-b-purple-sh-0 mx-14 py-3 '>
      <div className='flex place-items-center basis-1/2' >
        <img src={img} className='rounded-full h-12 w-12' />
        <p className='text-lg px-7' > {blocked.username} </p>
      </div>
      <div className='flex flex-row-reverse  place-items-center basis-1/2' >
         
            <button className="rounded-lg bg-purple-sh-0 focus:outline-none border-none hover:bg-purple text-sm" onClick={UnblockUser}>Unblock</button>
      </div>
    </div>
  )
}

export default Blocked
