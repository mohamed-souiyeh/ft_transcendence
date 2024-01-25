import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useChannelContext } from "../../contexts/channelContext";

const mokChannel = {
  "id": 1,
  "type": "public",
  "channelName": "hazimo ra3d",
  "channelImage": "",
  "channelDescription": "an epic place to be in",
  "channelPassword": null,
  "ownerId": 1,
  "createdAt": "2024-01-16T13:55:37.481Z",
  "users": [
    {
      "id": 1,
      "username": "mohamed"
    },
  ],
  "usersState": [
    {
      "id": 1,
      "state": "active",
      "role": "owner",
      "untile": null,
      "userId": 1,
      "channelId": 1
    }
  ]
};

type channelType = typeof mokChannel;


function GroupMembers({createdGroup, setCreatedGroup, isChannel = false} : {createdGroup: { name: "", privacy:"", password:"", description: "", members: [], } , setCreatedGroup: Dispatch<SetStateAction<Object>>} ) {

const [ data, setData ] = useState<{
  id: number,
  username: string,
  added: boolean,
}[]>([]);
  
  let { channel } = useChannelContext();


  useEffect(() => {
    console.log("data: ", data);
  }, [data])


  useEffect(() => {
    axios.get('http://localhost:1337/users/friends',
    {
      withCredentials: true,
    }).then((res) => {
      // console.log("this is the friends response :", res);
      // console.log("friends: ", res.data);
      let friends: {
        id: number,
        username: string,
        added: boolean,
      }[] = res.data.map((friend) => ({...friend, added: false}));
    
      if (isChannel) {
        const tmp_channel = channel as channelType;

        friends = friends.filter((friend) => tmp_channel.users.find((user) => user.id === friend.id) === undefined);
      }

      setData(friends);
    }).catch((err) => {
      console.log("error in friends page: ", err);
    });
  }, [])


  const addMember = (friend) => {
    friend.added = !friend.added
    setCreatedGroup({...createdGroup, members : [...createdGroup.members, friend] } )
  }

  const removeMember = (friend) => {
    friend.added = !friend.added
    setCreatedGroup({...createdGroup, members: createdGroup.members.filter((elem) => elem != friend)} )
  }


  return (
    <>
      {data.length ? data.map((friend) => (
        <div key={friend.id} className='flex bg-purple-sh-1 my-2 mx-3 rounded-lg'>
          <div className='basis-2/3 m-2'>
            <p className='text-xl pl-3 pt-2'> {friend.username} </p>
          </div>
          <div className='flex flex-row-reverse m-3 basis-1/3 items-center'>
            { friend.added ?
              <button type="button" onClick={() => removeMember(friend)} className="rounded-lg bg-purple-sh-2 h-10 w-28"> added </button> : 
              <button type="button" onClick={() => addMember(friend)} className="rounded-lg bg-purple h-10 w-28"> add </button>
            }
          </div>
        </div>
      ))
        :  <p className="text-xl text-purple/50 p-5"> You have no friends </p> 
      }
    </>
  )
}

export default GroupMembers
