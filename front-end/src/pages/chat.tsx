import { useState } from 'react'
import SideBar from './components/sidebar'
import Messages from './components/messages'
import Rooms from './components/rooms'
import Network from './components/network'
import { subpages } from './chat.enums'



function Chat() {
  const [selected, setSelected] = useState(subpages.NETWORK)

  const setSelectedState = (id: number) => {
    setSelected(id)
  }
  console.log("hello from here")

  return (
    <>
      <SideBar/>
      <div className='w-screen h-screen bg-purple-sh-2 flex flex-row'>
        <div className='basis-1/4 pl-20'>

          <div className={`${selected === subpages.NETWORK ? 'bg-[#48435E]' :'bg-purple-sh-1'} p-4 my-5 rounded-lg hover:cursor-pointer focus:bg-purple`} onClick={() => setSelectedState(subpages.NETWORK)}>
            <p className='text-4xl' >Network </p>
          </div>

          <div className={`${selected === subpages.CHAT ? 'bg-[#48435E]' :'bg-purple-sh-1'} my-5 rounded-lg h-[500px] overflow-auto scrollbar-thin scrollbar-thumb-[#48435E]`} onClick={() => setSelectedState(subpages.CHAT)}>
            <div className="sticky top-0 bg-opacity-70 backdrop-blur-sm px-4 py-2" >
              <p className="text-4xl ">Messages</p>
            </div>
            <p className='text-l' >guess we need a component here :') </p>
          </div>

          <div className={`${selected === subpages.CHANNELS ? 'bg-[#48435E]' :'bg-purple-sh-1'} my-5 rounded-lg h-[325px] overflow-auto scrollbar-thin scrollbar-thumb-[#48435E]`} onClick={() => setSelectedState(subpages.CHANNELS)}>
            <div className="sticky top-0 bg-opacity-70 backdrop-blur-sm px-4 py-2" >
              <p className="text-4xl ">Rooms</p>
            </div>
            <p className='text-l' >and another here here :') </p>
          </div>

        </div>
        <div className='basis-2/3 m-5 bg-purple-sh-1'>

          {selected === subpages.NETWORK ? <Network/> : (selected === subpages.CHAT ? <Messages/> : <Rooms/>)}
        </div>

      </div>
    </>
  )
}

export default Chat
