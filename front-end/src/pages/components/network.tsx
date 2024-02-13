/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import Friends from "./friends"
import Requests from "./requests"
import Blocked from "./blocked"
import axios from "axios"
import { networkTabs } from "../chat.enums"
import { useNotificationContext } from "../../contexts/notificationContext"

function Network(props) {
  const [tab, setTab] = useState(networkTabs.FRIENDS)
  const [refresh, setRefresh] = useState(false)
  const {notification, setNotification} = useNotificationContext()

  const setTabNum = (id: number) => {
    setTab(id)
  }
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {
    console.log("network tab mounted");
    axios.get(`${process.env.REACT_URL}:1337/users/network`,
      {
        withCredentials: true,
      }).then((res) => {
        // console.log("this is the network tab response :", res);
        setFriendRequests(res.data.friendRequests);
        setBlockedUsers(res.data.blockedUsers);
        setFriends(res.data.friends);
        setRefresh(false);
          // console.log("friend requests: ", friendRequests);
          // console.log("blocked users: ", blockedUsers);
          // console.log("friends: ", friends);
      }).catch((err) => {
        console.log("error in network tab: ", err);
      });

  }, [tab, refresh])

  // useEffect(() => {
  // }, [friendRequests, blockedUsers, friends]);

  const handleUnmount = () => {
    console.log("unmounting tab: ", tab);
    setRefresh(true);
  };


  const { refreshDms } = props;
  //well I know my poor memory and rushing might get me to remove that useEffect BUT DON'T, it's there to make sure we're running that code just once, there;s another useEff above that checks on tabs and that make re-rendering occure 
  useEffect ( () => {

  if (notification){
    setNotification(false)
    setTab(networkTabs.REQUESTS)
  }
  },[])

  return (
    <>
      <div>
        {/* div for tabs */}
        <div className='flex'>

          <div className={`${tab === networkTabs.FRIENDS ? 'bg-purple-sh-1' : 'bg-purple-sh-0'} basis-1/3 p-3 hover:cursor-pointer`} onClick={() => setTabNum(networkTabs.FRIENDS)}>
            <p className="text-2xl"> Friends </p>
          </div>
          <div className={`${tab === networkTabs.REQUESTS ? 'bg-purple-sh-1' : 'bg-purple-sh-0'} basis-1/3 p-3 hover:cursor-pointer`} onClick={() => setTabNum(networkTabs.REQUESTS)}>
            <p className="text-2xl">Requests </p>

          </div>
          <div className={`${tab === networkTabs.BLOCKED ? 'bg-purple-sh-1' : 'bg-purple-sh-0'} basis-1/3 p-3 hover:cursor-pointer`} onClick={() => setTabNum(networkTabs.BLOCKED)}>
            <p className="text-2xl"> Blocked</p>

          </div>
        </div>
      </div>

      <div className="overflow-hidden bg-purple-sh-1 h-[93%]">
        <div className="overflow-auto scrollbar-thin scrollbar-thumb-purple-sh-0 h-[100%]">
          {/* divs for tabs content*/}
          {tab === networkTabs.FRIENDS ? (friends.length ? friends.map((user) => < Friends refreshDms={refreshDms} friend={user} unmount={handleUnmount} id={user.id} key={user.id} />) : <p className="text-2xl p-4 pt-7 text-purple-tone-2 text-opacity-60"> Look at you Lonely lil sh*t :')</p>)
            : (tab === networkTabs.REQUESTS ? (friendRequests.length ? friendRequests.map((user) => < Requests request={user} unmount={handleUnmount} id={user.id} key={user.id} />) : <p className="text-2xl p-4 pt-7 text-purple-tone-2 text-opacity-60">hmm seems like u have no friends requests, maybe nobody wants u</p>)
              : (blockedUsers.length ? blockedUsers.map((user) => < Blocked blocked={user} unmount={handleUnmount} id={user.id} key={user.id} />) : <p className="text-2xl p-4 pt-7 text-purple-tone-2 text-opacity-60">your list of blocked users is empty, but we're pretty sure your name is in so many lists</p>))}
        </div>
      </div>
    </>
  )
}

export default Network
