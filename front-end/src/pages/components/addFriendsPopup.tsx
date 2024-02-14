import logo from "../../assets/Logo.svg"
import { useContext, useEffect, useState } from "react"
import GroupMembers from "./groupMembers"
import { useAddFriendsPopupContext } from "../../contexts/addFriendsPopupContext"
import { UserContext } from "../../App"
import { useChannelContext } from "../../contexts/channelContext"

function AddFriendsPopup() {
  const {setAddFriendsPopup} = useAddFriendsPopupContext()
  const [createdGroup, setCreatedGroup] = useState<{
    members: {
      id: number,
      username: string,
      added: boolean,
    }[],
  }>({
    members: [],
  });

  const { channel } = useChannelContext();

  const { user } = useContext(UserContext);

  useEffect(() => {
  }, [createdGroup])

  const handleSubmit = (e : React.FormEvent) => {
    e.preventDefault()
    if (user.chat) {
      for (const member of createdGroup.members) {
        user.chat.emit('addUser', {
          convId: channel.id,
          convType: channel.type,
          targetedUserId: member.id,
        });
      }
    }
    setAddFriendsPopup(false)
  }

  return (
    <div className="h-screen w-screen bg-purple-sh-1 bg-opacity-30 backdrop-blur-sm absolute z-40 grid place-content-center" onClick={() => {setAddFriendsPopup(false)}} > 
      <div className="h-[35rem] w-l-card-w bg-purple bg-opacity-20 p-4 rounded-xl " onClick={(e) => {e.stopPropagation()}}>
        <div className="grid place-content-center h-11 py-2">
          <img src={logo} className="h-11 w-11" />
        </div>
        <div className="grid place-content-center py-2">
          <p className="text-xl font-bold py-2" >Add More members </p>
        </div>
          <form onSubmit={handleSubmit} className=" h-[22rem]">
            <div className="h-[100%] border-4 rounded-lg border-purple-sh-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-purple-sh-0  py-2">
              <GroupMembers createdGroup={createdGroup} setCreatedGroup={setCreatedGroup} isChannel={true}/>
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
