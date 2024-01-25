import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function SearchResaults(friend) {

  const nav = useNavigate()

  return (
    <>
      <div key={friend.id} className='flex bg-purple-sh-1 my-2 mx-3 rounded-lg'>
        <div className=' flex basis-3/5 m-2'>
          <img src={friend.avatar} className="w-12 h-12 rounded-full"/>
          <p className='text-xl pl-3 pt-2'> {friend.name} </p>
        </div>
        <div className='flex flex-row-reverse m-3 basis-2/5 items-center'>
            <button type="button"  onClick={() => nav('/' + friend.name)}  className="rounded-lg bg-purple h-11"> visit profile  </button> 

        </div>
      </div>
    </>
  )
}

export default SearchResaults
