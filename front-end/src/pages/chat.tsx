import { useContext, useEffect, useState } from 'react'
import SideBar from './components/sidebar'
import Messages from './components/messages'
import Rooms from './components/rooms'
import Network from './components/network'
import Contacts from './components/contacts'
import { useDmContext } from '../contexts/chatContext'
import Channels from './components/channels'
import { useChannelContext } from '../contexts/channelContext'
import { subpages } from './chat.enums'
import axios from 'axios'
import { UserContext } from '../App'
import { useNavigate } from 'react-router-dom'
import AddFriendsPopup from './components/addFriendsPopup'
import PwdPopup from './components/pwdPopup'
import { usePwdPopupContext } from '../contexts/pwdPopupContext'
import { useAddFriendsPopupContext } from '../contexts/addFriendsPopupContext'

const mokDm = { id: 0, users: [{ id: 0, username: "test" }] };

type dmType = typeof mokDm;

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

function Chat() {
  const nav = useNavigate()
  const [selected, setSelected] = useState(subpages.NETWORK)
  const { dm, setDm } = useDmContext()
  const { channel, setChannel } = useChannelContext()
  const { user } = useContext(UserContext);
  const { pwdPopup} = usePwdPopupContext()
  const {addFriendsPopup} = useAddFriendsPopupContext()


  const setSelectedState = (id: number) => {
    setSelected(id);
  }

  const [dms, setDms] = useState<dmType[]>([]);
  const [refreshDms, setRefreshDms] = useState(false);

  useEffect(() => {
    console.log("user: ", user);
    console.log("dms refreshed");
    axios.get('http://localhost:1337/conv/dms',
      {
        withCredentials: true,
      }).then((res) => {
        // console.log("this is the chat page response :", res);
        setDms(res.data.dms);
        setRefreshDms(false);
      }).catch((err) => {
        console.log("error in chat page: ", err);
      });

  }, [refreshDms])


  useEffect(() => {
    if (Object.keys(dm).length) {
      if (Object.keys(channel).length) {
        setChannel({})
      }
      setSelected(subpages.CHAT);
      console.log("dm is: ", dm);
    }
  }, [dm])




  const [channels, setChannels] = useState<channelType[]>([]);
  const [refreshChannels, setRefreshChannels] = useState(false);

  useEffect(() => {
    console.log("channels refreshed");
    axios.get('http://localhost:1337/conv/channels',
      {
        withCredentials: true,
      }).then((res) => {
        setChannels(res.data.channels);
        setRefreshChannels(false);
        if (Object.keys(channel).length) {
          setChannel(res.data.channels.find((refreshedChannel) => refreshedChannel.id === channel.id));
        }
      }).catch((err) => {
        console.log("error in chat page: ", err);
      });
  }, [refreshChannels]);






  useEffect(() => {
    if (Object.keys(channel).length) {
      if (Object.keys(dm).length) {
        setDm({})
      }
      setSelected(subpages.CHANNELS);
    }
  }, [channel])


  return (
    <>
      <SideBar />
      { pwdPopup &&  <PwdPopup/> }
      { addFriendsPopup && <AddFriendsPopup />}
      <div className='w-screen h-screen bg-purple-sh-2 flex flex-row ' >
        <div className='basis-1/4 pl-20'>

          <div className={`${selected === subpages.NETWORK ? 'bg-[#48435E]' : 'bg-purple-sh-1'} p-4 my-5 rounded-lg hover:cursor-pointer focus:bg-purple`} onClick={() => setSelectedState(subpages.NETWORK)}>
            <p className='text-4xl' >Network </p>
          </div>

          <div className={`bg-purple-sh-1 my-5 rounded-lg h-[500px] overflow-auto scrollbar-thin scrollbar-thumb-[#48435E]`} onClick={() => {
            setRefreshDms(true)
          }}>
            <div className="sticky top-0 bg-opacity-70 backdrop-blur-sm px-4 py-2" >
              <p className="text-4xl ">Messages</p>
            </div>
            {(dms.length ? dms.map((dm) => <Contacts id={dm.id} user={dm.users.find((User) => User.username !== user.data.username)} key={dm.id} dmInfo={dm} />) : <p className="text-2xl p-4 pt-7 text-purple-tone-2 text-opacity-60"> No messages yet :(</p>)}
          </div>

          <div className='bg-purple-sh-1 my-5 rounded-lg h-[325px] overflow-auto scrollbar-thin scrollbar-thumb-[#48435E]' onClick={() => { setRefreshChannels(true) }}>
            <div className="flex items-center sticky top-0 bg-opacity-70 backdrop-blur-sm px-4 py-2" >
              <div className='basis-10/12'>
                <p className="text-4xl ">Rooms</p>
              </div>
              <div className='grid basis-2/12 place-items-end p-3'>
                <svg className='hover:cursor-pointer mr-1' onClick={() => {nav('/groups')}} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 15 15" fill="none">
                  <path d="M13.6339 8.8691H8.86479V13.6342C8.86479 14.3885 8.25623 15 7.50197 15C6.74771 15 6.13947 14.3885 6.13947 13.6339V8.8658H1.3681C0.613835 8.8658 0.000646717 8.25426 0.000977099 7.49967C0.000646717 7.1227 0.152953 6.77712 0.399748 6.53033C0.646874 6.28287 0.987828 6.1266 1.36446 6.1266H6.13947V1.36514C6.13947 0.987842 6.28914 0.646226 6.53626 0.399761C6.78339 0.152636 7.12335 -0.000330925 7.50065 -0.000330925C8.25458 -0.000330925 8.86479 0.611206 8.86479 1.36514V6.12693H13.6339C14.3881 6.12693 14.9997 6.74376 14.9993 7.49802C14.999 8.25195 14.3875 8.8691 13.6339 8.8691Z" fill="#8176AF"/>
                </svg>
              </div>

            </div>
            {(channels.length ? channels.map((channel) => <Channels currentChannel={channel} key={channel.id} />) : <p className="text-2xl p-4 pt-7 text-purple-tone-2 text-opacity-60"> No messages yet :(</p>)}
          </div>
        </div>
        <div className='relative basis-2/3 m-5 '>
          {selected === subpages.NETWORK ? <Network refreshDms={setRefreshDms} /> : (selected === subpages.CHAT ? <Messages /> : <Rooms setRefreshChannels={setRefreshChannels}/>)}
        </div>

      </div>
    </>
  )
}

export default Chat
