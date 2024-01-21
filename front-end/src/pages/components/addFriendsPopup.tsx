import logo from "../../assets/Logo.svg"
import { useState } from "react"
import GroupMembers from "./groupMembers"

function AddFriendsPopup() {
  const [createdGroup, setCreatedGroup] = useState({
    members: [],
  })

  const handleSubmit = (e : React.FormEvent) => {
    e.preventDefault()
    console.log("salina")
  }

  return (
    <div className="h-screen w-screen bg-purple-sh-1 bg-opacity-30 backdrop-blur-sm absolute z-40 grid place-content-center" > 
      <div className="h-[35rem] w-l-card-w bg-purple bg-opacity-20 p-4 rounded-xl ">
        <div className="grid place-content-center h-11 py-2">
          <img src={logo} className="h-11 w-11" />
        </div>
        <div className="grid place-content-center py-2">
          <p className="text-xl font-bold py-2" >Add More members </p>
        </div>
          <form onSubmit={handleSubmit} className=" h-[22rem]">
            <div className="h-[100%] border-4 rounded-lg border-purple-sh-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-purple-sh-0  py-2">
              <GroupMembers createdGroup={createdGroup} setCreatedGroup={setCreatedGroup}/>
            </div>
            <div className="grid place-content-center my-4">
              <button type="submit" className="bg-purple hover:bg-purple-tone-1 hover:text-purple-sh-1 rounded-lg "> Confirm Changes </button>
            </div>
          </form >
      </div>
    </div>
  )
}

export default AddFriendsPopup
