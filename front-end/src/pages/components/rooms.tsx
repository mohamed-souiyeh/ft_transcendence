import { useChannelContext } from "../../contexts/channelContext"
import { useContext, useEffect, useRef, useState } from "react"
import Icons from "./icons"
import Bubble from "./bubble"
import GroupsIcons from "./groupsIcons"
import { UserContext } from "../../App"

const dummymsg = {
  "id": 1,
  "authorInfo": {
    "username": "mohamed",
    "id": 1,
    "role": "owner",
    "usersAuthorBlockedBy": [
      {
        "id": 2,
        "username": "msouiyeh"
      }
    ]
  },
  "message": "yo wsuup everyone",
  "convType": "public",
  "convId": 1,
  "bannedUsers": [
    {
      "id": 3,
      "state": "banned",
      "role": "user",
      "untile": null,
      "userId": 3,
      "channelId": 1
    }
  ]
};

type msgType = typeof dummymsg;

function Rooms(props: object) {

  const [val, setVal] = useState('')
  const maxLength = 20;
  const { channel } = useChannelContext()
  const [msgs, setMsgs] = useState<msgType[]>([])
  const { user } = useContext(UserContext);

  const [isBaned, setIsBaned] = useState(false);
  const [isMuted, setIsMuted] = useState(false);


  //NOTE - we gonna use this to refresh the channels when we get the update event
  const { setRefreshChannels } = props;

  const messagesEndRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [msgs]);


  useEffect(() => {
    if (!Object.keys(channel).length) return;

    user.chat.timeout(5000).emit('getAllMessages', {
      convId: channel.id,
      convType: channel.type,
    }, (err, msgs) => {
      if (err) {
        console.log("error in getting messages: ", err);
        console.log("exeption: ", user.chatException);
        return;
      }
      // console.log("the res is: ", JSON.stringify(msgs, null, 2));
      setMsgs(msgs);
    });

    // console.log("channel is: ", channel);
    // console.log("user is: ", user);
    // console.log("is banned :", channel.usersState.find((userState) => userState.userId === user.data.id).state);

    const state = channel.usersState.find((userState) => userState.userId === user.data.id)?.state;

    setIsBaned(state === 'banned');
    setIsMuted(state === 'muted');

    user.chat.on('broadcast', (msg) => {
      // console.log("the msg is: ", msg);
      setMsgs(prevMsgs => [...prevMsgs, msg]);
    });

    user.chat.on('update', () => {
      setRefreshChannels(true);
    });

    return () => {
      user.chat.off('broadcast');
      user.chat.off('update');
    }
  }, [channel])

  const sendMsg = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //we probably should first check on the msg if it isn't empty
    if (val) {
      if (user.chat) {
        user.chat.emit('channelmsg', {
          authorUsername: user.data.username,
          message: val,
          convType: channel.type,
          convId: channel.id,
        });
        setVal('')
      }
    }
  }


  return (
    <div className="bg-purple-sh-1 h-[100%] pb-10 ">
      {Object.keys(channel).length ?
        <>
          <div className="flex sticky bg-purple-s-0 w-[100%] border border-transparent border-b-purple-sh-2 p-5 ">
            <div className="basis-11/12 flex">
              <div className="grid px-3 ">
                <p className="text-xl font-semibold text-purple-tone-2"> {channel.channelName} </p>
                <p className="text-impure-white/40  truncate"> {channel.type}, {channel.users.length} members </p>
              </div>
            </div>
            <div className="flex flex-row-reverse self-center basis-1/12" >
              <GroupsIcons channel={channel} refreshChannels={setRefreshChannels} />
            </div>
          </div>

          <div className="h-[87%] overflow-scroll scrollbar-thin scrollbar-thumb-purple-sh-0 " ref={messagesEndRef}>
            {(msgs.length ?
              msgs.map(
                (msg) => {
                  let message = msg.message

                  if (msg.authorInfo.usersAuthorBlockedBy.find((blockedUser) => blockedUser.id === user.data.id))
                    message = "you are blocked by this user";
                  if (isBaned)
                    message = "you are banned from this channel";

                  console.log("the message is: ", msgs);

                  return <Bubble left={msg.authorInfo.username !== user.data.username} username={msg.authorInfo.username} message={message} key={msg.id} isBanned={(isBaned || isMuted)}
                    authorState={channel.usersState.find((userState) => userState.userId === msg.authorInfo.id)?.state}
                    authorInfo={msg.authorInfo}
                  />
                }) : <p className="text-2xl p-4 pt-7 text-purple-tone-2 text-opacity-60"> No messages yet :(</p>)
            }
          </div>
          <div className="fixed bottom-5 bg-purple-sh-0 w-[66%] h-12 m-2 rounded-lg px-2">
            {(!isBaned && !isMuted) ? <form onSubmit={sendMsg} className="flex items-center">
              <input value={val} maxLength={maxLength} onChange={(e) => setVal(e.target.value)} type='text' placeholder="send a Messages" className='w-[98%] h-12 bg-transparent outline-none rounded-lg text-impure-white px-2 place-self-center' />
              <button type="submit" className="hover:border-none border-none focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="22" viewBox="0 0 23 22" fill="none">
                  <path d="M0.65512 3.39707C0.299441 2.42337 0.567117 1.34515 1.33806 0.651097C2.10717 -0.0402098 3.20262 -0.196075 4.13215 0.255933L20.7152 7.99783C21.6044 8.41409 22.2406 9.17416 22.4982 10.0818H4.20824L0.707371 3.51351C0.688121 3.47592 0.670703 3.43649 0.65512 3.39707ZM4.22107 11.9165L0.780707 18.4949C0.761456 18.5315 0.744956 18.5682 0.731205 18.6067C0.376444 19.5813 0.646869 20.6577 1.41781 21.3509C1.89541 21.779 2.4986 22 3.10545 22C3.48038 22 3.85622 21.9157 4.2064 21.7442L20.717 14.0078C21.609 13.5897 22.2442 12.8269 22.5 11.9174H4.22107V11.9165Z" fill="#201E2D" />
                  <defs>
                    <clipPath id="clip0_383_580">
                      <rect width="22" height="22" fill="white" transform="translate(0.5)" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </form > :
              <p className="text-2xl p-1 text-purple-tone-2 text-opacity-60">{
                isBaned ? "you are banned from this channel" : "you are muted from this channel"
              }</p>
            }
          </div>
        </> : <p className="text-2xl p-4 pt-7 text-purple-tone-2 text-opacity-60"> No channel selected :(</p>
      }
    </div>
  )
}

export default Rooms
