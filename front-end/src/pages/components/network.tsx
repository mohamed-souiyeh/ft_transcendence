import { useState } from "react"
import Friends from "./friends"
import Requests from "./requests"
import Blocked from "./blocked"

function Network() {
  const [tab, setTab] = useState(1)
  
  const setTabNum = (id: number) => {
    setTab(id)
  }

  return (
    <>
      <div>
        {/* div for tabs */}
        <div className='flex'>

          <div className={ `${tab === 1 ? 'bg-purple-sh-1' : 'bg-purple-sh-0'} basis-1/3 p-3 hover:cursor-pointer`} onClick={()=>setTabNum(1)}>
            <p className="text-2xl"> Friends </p>
          </div>
          <div className={ `${tab === 2 ? 'bg-purple-sh-1' : 'bg-purple-sh-0'} basis-1/3 p-3 hover:cursor-pointer`} onClick={()=>setTabNum(2)}>
            <p className="text-2xl">Requests </p>
            
          </div>
          <div className={ `${tab === 3 ? 'bg-purple-sh-1' : 'bg-purple-sh-0'} basis-1/3 p-3 hover:cursor-pointer`} onClick={()=>setTabNum(3)}>
            <p className="text-2xl"> Blocked</p>
            
          </div>
        </div>
      </div>

      <div>
        {/* divs for tabs content*/}
          {/* {selected === 1 ? <Network/> : (selected === 2 ? <Messages/> : <Rooms/>)} */}
        {tab === 1 ? <Friends/> : (tab === 2 ? <Requests/> : <Blocked/>)}
        <div className=''>
          <div className=''>
          </div>
          <div className=''>
          </div>
          <div className=''>
          </div>
        </div>

      </div>
    </>
  )
}

export default Network
