import { useContext } from "react"
import { UserContext } from "../../App"
import { useAvatarContext } from "../../contexts/avatar"

function History() { 

  const {avatar} = useAvatarContext()
  const {user} = useContext(UserContext)
  // const id = 1


  return (
    <>
      <div className='bg-purple/15 my-2 mx-4 rounded-lg p-2 flex place-items-center'>
        <div className="flex basis-1/3 items-center">
          <img src={avatar} className="rounded-full w-12 h-12 "/>
          <p className="mx-3"> {user.data.username} </p>
        </div>
        <div className="flex basis-1/3 justify-center"> -vs- </div>
        <div className="flex basis-1/3 items-center justify-end"> 
          <p className="mx-3"> {user.data.username} </p>
          <img src={avatar} className="rounded-full w-12 h-12 "/>
        </div>
      </div>

    </>
  )
}

export default History
