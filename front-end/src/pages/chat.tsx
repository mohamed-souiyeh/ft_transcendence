import { useEffect, useState } from 'react'
import SideBar from './components/sidebar'
import Messages from './components/messages'
import Rooms from './components/rooms'
import Network from './components/network'
import Contacts from './components/contacts'
import { useDmContext } from '../contexts/chatContext'
import Channels from './components/channels'
import { useChannelContext } from '../contexts/channelContext'
import Icons from './components/icons'

function Chat() {
  const [selected, setSelected] = useState(1)
  const {dm, setDm} = useDmContext()
  const {channel, setChannel} = useChannelContext()

  const setSelectedState = (id: number) => {
    setSelected(id)
  }

  const friends = [
    { name : 'lennie', id : 1 , message: 'ata7adaak fi lo3batti lpingpong', },
    { name : 'kennie', id : 2 , message: 'Hellooooooo!', },
    { name : 'bennie', id : 3 , message: 'aall of my demons are my friends are my frieeeends yeaaaa all of my demons are my friends are my frieeeends yeaaaa all of my demons are my friends are my frieeeends yeaaaa all of my demons are my friends are my frieeeends yeaaaa ll of my demons are my friends are my frieeeends yeaaaa ya, thats a song btw', },
    { name : 'dennie', id : 4 , message: 'b', },
    { name : 'jennie', id : 5 , message: 'darling you re my best friend', },
  ]

  useEffect(() => {
    if (Object.keys(dm).length) {
      if(Object.keys(channel).length) {
        setChannel({})
      }
      setSelected(2)
    }
  }, [dm])

  useEffect(() => {
    if (Object.keys(channel).length){
      if(Object.keys(dm).length){
        setDm({})
      }
      setSelected(3)
    }
  }, [channel])

  return (
    <>
      <SideBar/>
      <div className='w-screen h-screen bg-purple-sh-2 flex flex-row'>
        <div className='basis-1/4 pl-20'>

          <div className={`${selected === 1 ? 'bg-[#48435E]' :'bg-purple-sh-1'} p-4 my-5 rounded-lg hover:cursor-pointer focus:bg-purple`} onClick={() => setSelectedState(1)}>
            <p className='text-4xl' >Network </p>
          </div>

          <div className={`bg-purple-sh-1 my-5 rounded-lg h-[500px] overflow-auto scrollbar-thin scrollbar-thumb-[#48435E]`} >
            <div className="sticky top-0 bg-opacity-70 backdrop-blur-sm px-4 py-2" >
              <p className="text-4xl ">Messages</p>
            </div>
           { (friends.length ? friends.map((user)=> <Contacts id={user.id} message={user.message} name={user.name} key={user.id}/>) : <p className="text-2xl p-4 pt-7 text-purple-tone-2 text-opacity-60"> No messages yet :(</p> ) }
          </div>

          <div className='bg-purple-sh-1 my-5 rounded-lg h-[325px] overflow-auto scrollbar-thin scrollbar-thumb-[#48435E]'>
            <div className="flex items-center sticky top-0 bg-opacity-70 backdrop-blur-sm px-4 py-2" >
              <div className='basis-11/12'>
                <p className="text-4xl ">Rooms</p>
              </div>
      <div className="flex flex-row-reverse basis-1/12 cursor-pointer" onClick={() => console.log('open menu')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="23" viewBox="0 0 8 23" fill="none">
            <path d="M0.820641 2.84711C0.820641 1.27359 2.09352 0 3.66631 0C5.23911 0 6.5127 1.27216 6.5127 2.84711C6.5127 4.41775 5.24126 5.69278 3.66631 5.69278C2.09352 5.69278 0.820641 4.41775 0.820641 2.84711ZM0.820641 11.6474C0.820641 10.0775 2.0928 8.80034 3.66559 8.80034C5.23839 8.80034 6.51198 10.0761 6.51198 11.6474C6.51198 13.2188 5.24054 14.496 3.66559 14.496C2.09351 14.4946 0.820641 13.2188 0.820641 11.6474ZM0.820641 20.155C0.820641 18.5823 2.09352 17.3072 3.66703 17.3072C5.23839 17.3072 6.51198 18.5801 6.51198 20.155C6.51198 21.725 5.24054 23 3.66703 23C2.09352 23 0.820641 21.725 0.820641 20.155Z" fill="#8176AF"/>
          <defs>
            <clipPath id="clip0_1311_182">
              <rect width="23" height="7" fill="white" transform="matrix(0 1 1 0 0.0833359 0)"/>
            </clipPath>
          </defs>
        </svg>
      </div>
            </div>
           { (friends.length ? friends.map((user)=> <Channels id={user.id} message={user.message} name={user.name} key={user.id}/>) : <p className="text-2xl p-4 pt-7 text-purple-tone-2 text-opacity-60"> No messages yet :(</p> ) }
          </div>
        </div>
        <div className='relative basis-2/3 m-5 '>
          {selected === 1 ? <Network/> : (selected === 2 ? <Messages/> : <Rooms/>)}
        </div>

      </div>
    </>
  )
}

export default Chat
