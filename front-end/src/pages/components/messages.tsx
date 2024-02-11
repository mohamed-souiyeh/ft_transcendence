import { useContext, useEffect, useRef, useState } from "react"
import { useDmContext } from "../../contexts/chatContext"
import Icons from "./icons"
import Bubble from "./bubble"
import { UserContext } from "../../App"

const dumy_msg = {
  authorInfo: {
    autorId: 2,
    username: "msouiyeh"
  },
  id: 2,
  message: 'hello i am msouiyeh',
  convType: 'dm',
  convId: 7
};

type msgType = typeof dumy_msg;
function Messages() {

  const { dm, setDm } = useDmContext();
  const [val, setVal] = useState('');
  const [status, setStatus] = useState("online");
  const [msgs, setMsgs] = useState<msgType[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const isBlockedRef = useRef(isBlocked);
  const [img, setImg] = useState('')

  useEffect(() => {
    isBlockedRef.current = isBlocked;
  }, [isBlocked]);

  const maxLength = 42;

  const { user } = useContext(UserContext);

  const messagesEndRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [msgs]);

  useEffect(() => {
    const setIntervalId: NodeJS.Timeout = setInterval(() => {
      // console.log("dm is: ", dm);
      user.chat.timeout(1000).emit('checkDmpls', {
        convId: dm.id,
        convType: dm.type,
      }, (err, res) => {
        if (err) {
          console.log("error in checking if the user is blocked: ", err)
          // console.log("the res is: ", res);
          return;
        }
        // console.log("isBlocked is: ", res);
        if (res.isBlocked !== isBlockedRef.current)
          setIsBlocked(res.isBlocked);
      });
    }, 1000);

    return () => {
      clearInterval(setIntervalId);
    }
  }, [dm]);


  useEffect(() => {
    //NOTE - here we need to fetch the public data of the user and set the status from it

    user.chat.timeout(1000).emit('checkDmpls', {
      convId: dm.id,
      convType: dm.type,
    }, (err, res) => {
      if (err) return console.log("error in checking if the user is blocked: ", err);
      console.log("isBlocked is: ", res);
      setIsBlocked(res.isBlocked);
      if (res.isBlocked === false) {
        //NOTE - fetch the messages of the dm using the dm.id and dm.type from the chatGatway
        user.chat.timeout(5000).emit('getAllMessages', {
          convId: dm.id,
          convType: dm.type,
        }, (err, messages) => {
          if (err) return console.log("error in getting all messages: ", err);
          console.log("messages are: ", messages);
          setMsgs(messages);
        })
      }
    })

    // console.log("user: ", user);

    user.chat.on('broadcast', (msg) => {
      setMsgs(prevMsgs => [...prevMsgs, msg]);
    });

    setImg(`${process.env.REACT_URL}:1337/users/${dm.userId}/avatar`);
    return () => {
      user.chat.off('broadcast');
    }
  }, [dm])


  const sendMsg = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //we probably should first check on the msg if it isn't empty
    if (val) {
      if (user.chat) {
        user.chat.emit('dmmsg', {
          authorUsername: user.data.username,
          message: val,
          convType: dm.type,
          convId: dm.id,
        });
      }
      // console.log("user.chat is: ", user.chat);
      setVal('');
    }
  }

  return (
    <div className="bg-purple-sh-1 h-[100%] pb-10 ">
      <div className="flex sticky bg-purple-s-0 w-[100%] border border-transparent border-b-purple-sh-2 p-5 ">
        <div className="basis-11/12 flex">
          <img src={img} className="h-14 w-14 rounded-full" />
          <div className="grid px-3 ">
            <p className="text-xl font-semibold text-purple-tone-2"> {dm.username} </p>
            <p className="text-impure-white/40  truncate"> {status} </p>
          </div>
        </div>
        <div className="flex flex-row-reverse self-center basis-1/12" >
          <Icons user={{ id: dm.userId, username: dm.username }} />
        </div>
      </div>

      <div className="h-[87%] overflow-scroll scrollbar-thin scrollbar-thumb-purple-sh-0" ref={messagesEndRef}>
        {
          isBlocked ? <p className="text-2xl p-4 pt-7 text-purple-tone-2 text-opacity-60"> One of you blocked the other</p> :
            (msgs.length ? msgs.map((msg) => <Bubble left={msg.authorInfo.username !== user.data.username} username={msg.authorInfo.username} message={msg.message} key={msg.id} />) : <p className="text-2xl p-4 pt-7 text-purple-tone-2 text-opacity-60"> No messages yet :(</p>)}
      </div>
      <div className="fixed bottom-5 bg-purple-sh-0 w-[66%] h-12 m-2 rounded-lg px-2">
        {!isBlocked ? <form onSubmit={sendMsg} className="flex items-center">
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


        </form > : <p className="text-2xl p-1 text-purple-tone-2 text-opacity-60"> One of you blocked the other</p>}
      </div>
    </div>
  )
}

export default Messages
