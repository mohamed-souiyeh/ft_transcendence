import logo from "../../assets/Logo.svg"
import { useState } from "react"
import { useProtectedRoomContext } from "../../contexts/ProtectedRoomContext"

function ProtectedRoomPopup() {

  const [val, setVal] = useState("")
  const {setProtectedRoom} = useProtectedRoomContext()


  const handleSubmit = (e : React.FormEvent) => {
    e.preventDefault()
    if (!val)
    return setProtectedRoom({
      state: false,
      password: undefined
    })

    setProtectedRoom({
      state: false,
      password: val
    })
  }



  return (
    <div className="h-screen w-screen bg-purple-sh-1 bg-opacity-40 backdrop-blur-sm absolute z-40 grid place-content-center" onClick={() => {setProtectedRoom({
      state: false,
      password: undefined
    })}} > 
      <div className="h-l-card-h w-l-card-w bg-purple bg-opacity-20 p-4 rounded-xl grid place-content-center shadow-xl shadow-black/30" onClick={(e) => {e.stopPropagation()}}>
        <div className="grid place-content-center h-11 py-2">
          <img src={logo} className="h-16 w-16" />
        </div>
        <div className="grid place-content-center pt-4">
          <p className="text-2xl font-bold " > This Room is Protected </p>
        </div>
        <div className="grid place-content-center ">
          <p className="text-lg" > please enter its Password </p>
        </div>
        <form onSubmit={handleSubmit} >
          <div className="grid place-content-center my-4">

            <input onChange={(e) => setVal(e.target.value)} type='password' className='h-12 p-3 bg-purple-sh-2 rounded-lg  border-transparent outline-none placeholder:italic placeholder:text-purple/60'/>
            <button type="submit" className="bg-purple hover:bg-purple-tone-1 hover:text-purple-sh-1 rounded-lg my-4"> Join </button>
          </div>
        </form >
      </div>
    </div>
  )
}

export default ProtectedRoomPopup
