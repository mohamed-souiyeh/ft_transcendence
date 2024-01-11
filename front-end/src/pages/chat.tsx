import { useEffect, useState } from 'react'
import SideBar from './components/sidebar'
import Messages from './components/messages'
import Rooms from './components/rooms'
import Network from './components/network'
import Contacts from './components/contacts'
import { useDmContext } from '../contexts/chatContext'

function Chat() {
  const [selected, setSelected] = useState(1)
  const {dm} = useDmContext()

  const setSelectedState = (id: number) => {
    setSelected(id)
  }

  const friends = [
    { name : 'lennie', id : 1 , message: 'ata7adaak fi lo3batti lpingpong', },
    { name : 'kennie', id : 2 , message: 'Hellooooooo!', },
    { name : 'bennie', id : 3 , message: 'all of my demons are my friends are my frieeeends yeaaaa ya, thats a song btw', },
    { name : 'dennie', id : 4 , message: 'brb', },
    { name : 'jennie', id : 5 , message: 'darling you re my best friend', },
  ]

  useEffect(() => {
    console.log("changes in Dm detected..", dm)
    if (Object.keys(dm).length)
      setSelected(2)
  }, [dm])

  return (
    <>
      <SideBar/>
      <div className='w-screen h-screen bg-purple-sh-2 flex flex-row'>
        <div className='basis-1/4 pl-20'>

          <div className={`${selected === 1 ? 'bg-[#48435E]' :'bg-purple-sh-1'} p-4 my-5 rounded-lg hover:cursor-pointer focus:bg-purple`} onClick={() => setSelectedState(1)}>
            <p className='text-4xl' >Network </p>
          </div>

          <div className={`bg-purple-sh-1 my-5 rounded-lg h-[500px] overflow-auto scrollbar-thin scrollbar-thumb-[#48435E]`} /* onClick={() => setSelectedState(2)} */>
            <div className="sticky top-0 bg-opacity-70 backdrop-blur-sm px-4 py-2" >
              <p className="text-4xl ">Messages</p>
            </div>
           { (friends.length ? friends.map((user)=> <Contacts id={user.id} message={user.message} name={user.name} key={user.id}/>) : <p className="text-2xl p-4 pt-7 text-purple-tone-2 text-opacity-60"> No messages yet :(</p> ) }
          </div>

          <div className={`${selected === 3 ? 'bg-[#48435E]' :'bg-purple-sh-1'} my-5 rounded-lg h-[325px] overflow-auto scrollbar-thin scrollbar-thumb-[#48435E]`} onClick={() => setSelectedState(3)}>
            <div className="sticky top-0 bg-opacity-70 backdrop-blur-sm px-4 py-2" >
              <p className="text-4xl ">Rooms</p>
            </div>
            <p className='text-l' >and another here here :') </p>
           {/* { (friends.length ? friends.map((user)=> <Channels id={user.id} message={user.message} name={user.name} key={user.id}/>) : <p className="text-2xl p-4 pt-7 text-purple-tone-2 text-opacity-60"> No messages yet :(</p> ) } */}
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
