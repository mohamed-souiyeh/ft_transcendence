/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import Friends from "./friends"
import Requests from "./requests"
import Blocked from "./blocked"
import axios from "axios"
import { networkTabs } from "../chat.enums"

function Network() {
  const [tab, setTab] = useState(networkTabs.FRIENDS)

  const setTabNum = (id: number) => {
    setTab(id)
  }
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {
    console.log("we are in the network tab useEffect")
    axios.get('http://localhost:1337/users/network',
    {
      withCredentials: true,
    }).then((res) => {
      console.log("this is the network tab response :", res);
      setFriendRequests(res.data.friendRequests);
      setBlockedUsers(res.data.blockedUsers);
      setFriends(res.data.friends);
    }).catch((err) => {
      console.log("error in network tab: ", err);
    });


  }, [tab])

  return (
    <>
      <div>
        {/* div for tabs */}
        <div className='flex'>

          <div className={ `${tab === networkTabs.FRIENDS ? 'bg-purple-sh-1' : 'bg-purple-sh-0'} basis-1/3 p-3 hover:cursor-pointer`} onClick={()=>setTabNum(networkTabs.FRIENDS)}>
            <p className="text-2xl"> Friends </p>
          </div>
          <div className={ `${tab === networkTabs.REQUESTS ? 'bg-purple-sh-1' : 'bg-purple-sh-0'} basis-1/3 p-3 hover:cursor-pointer`} onClick={()=>setTabNum(networkTabs.REQUESTS)}>
            <p className="text-2xl">Requests </p>

          </div>
          <div className={ `${tab === networkTabs.BLOCKED ? 'bg-purple-sh-1' : 'bg-purple-sh-0'} basis-1/3 p-3 hover:cursor-pointer`} onClick={()=>setTabNum(networkTabs.BLOCKED)}>
            <p className="text-2xl"> Blocked</p>

          </div>
        </div>
      </div>

      <div className="overflow-hidden h-[93%]">
        <div className="overflow-auto scrollbar-thin scrollbar-thumb-purple-sh-0 h-[100%]">
          {/* divs for tabs content*/}
          { tab === networkTabs.FRIENDS ? (friends.length ? friends.map((user)=> < Friends name={user.username} key={user.id}/>) : <p className="text-2xl p-4 pt-7 text-purple-tone-2 text-opacity-60"> Look at you Lonely lil sh*t :')</p> ) 
            : (tab === networkTabs.REQUESTS ? (friendRequests.length ? friends.map((user)=> < Requests name={user.username} key={user.id}/>) : <p className="text-2xl p-4 pt-7 text-purple-tone-2 text-opacity-60">hmm seems like u have no friends requests, maybe nobody wants u</p> ) 
              : (friends.length ? blockedUsers.map((user)=> < Blocked name={user.username} key={user.id}/>) : <p className="text-2xl p-4 pt-7 text-purple-tone-2 text-opacity-60">your list of blocked users is empty, but we're pretty sure your name is in so many lists</p> ) )}
        </div>
      </div>
    </>
  )
}

export default Network
