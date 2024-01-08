import { useState } from "react"
import Friends from "./friends"
import Requests from "./requests"
import Blocked from "./blocked"

function Network() {
  const [tab, setTab] = useState(1)

  const setTabNum = (id: number) => {
    setTab(id)
  }

  const friends = [
    { name : 'lennie', id : 1 },
    { name : 'kennie', id : 2 },
    { name : 'bennie', id : 3 },
    { name : 'dennie', id : 4 },
  ]

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

      <div className="overflow-hidden bg-purple-sh-1 h-[93%]">
        <div className="overflow-auto scrollbar-thin scrollbar-thumb-purple-sh-0 h-[100%]">
          {/* divs for tabs content*/}
          { tab === 1 ? (friends.length ? friends.map((user)=> < Friends name={user.name} key={user.id}/>) : <p className="text-2xl p-4 pt-7 text-purple-tone-2 text-opacity-60"> Look at you Lonely lil sh*t :')</p> ) 
            : (tab === 2 ? (friends.length ? friends.map((user)=> < Requests name={user.name} key={user.id}/>) : <p className="text-2xl p-4 pt-7 text-purple-tone-2 text-opacity-60">hmm seems like u have no friends requests, maybe nobody wants u</p> ) 
              : (friends.length ? friends.map((user)=> < Blocked name={user.name} key={user.id}/>) : <p className="text-2xl p-4 pt-7 text-purple-tone-2 text-opacity-60">your list of blocked users is empty, but we're pretty sure your name is in so many lists</p> ) )}
          {/* {tab === 1 ? <Friends/> : (tab === 2 ? <Requests/> : <Blocked/>)} */}

        </div>
      </div>
    </>
  )
}

export default Network
