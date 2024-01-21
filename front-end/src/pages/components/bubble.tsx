import { useNavigate } from "react-router-dom";
import { useChannelContext } from "../../contexts/channelContext"
import { Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { UserContext } from "../../App";
import { useContext } from "react";

function Bubble(props) {

  const { channel } = useChannelContext()
  const navigate = useNavigate()
  const { user } = useContext(UserContext);
  const { isBanned } = props;
  let isAdmin = true;

  if (Object.keys(channel).length) {
    isAdmin = (channel.usersState.find(fuser => fuser.userId === user.data.id)?.role === "modirator" || channel.usersState.find(fuser => fuser.userId === user.data.id)?.role === "owner") && !isBanned;

  }

  const visitProfile = () => {
    navigate('/' + props.username)
  }

  const setAsAdmin = () => {
    console.log("oh you got promoted, now back to work promoted slave")
  }

  const kickUser = () => {
    console.log("bye bye")
  }

  const ban = () => {
    console.log("for ever bye bye ??")
  }

  const unban = () => {
    console.log("unbaned");
  }

  const mute = () => {
    console.log("SHUT UPP MEG!")
  }

  const unmute = () => {
    console.log("unmuted");
  }

  return (
    <>
      {props.left ?
        <div className="flex ">
          <div className="grid max-w-[70%]">
            <div className="flex p-3 pb-0" >
              {/* make username clickable */}
              {Object.keys(channel).length ?

                <Menu>
                  <MenuHandler>
                    <button className="bg-transparent p-0 m-0">
                      {props.username}
                    </button>
                  </MenuHandler>
                  <MenuList className="bg-purple-sh-2 border border-purple">
                    <MenuItem onClick={() => { visitProfile() }} className="text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">Visit profile</MenuItem>
                    {isAdmin && <MenuItem onClick={() => { setAsAdmin() }} className="text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">Set as admin</MenuItem>}
                    {isAdmin && <MenuItem onClick={() => { ban() }} className="text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">Ban user</MenuItem>}
                    {isAdmin && <MenuItem onClick={() => { kickUser() }} className="text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">Kick user</MenuItem>}
                    {isAdmin && <MenuItem onClick={() => { mute() }} className="text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">Mute for 10 mins</MenuItem>}
                  </MenuList>
                </Menu>
                :
                <p className="text-purple-tone-2 font-bold"> {props.username} </p>
              }
            </div>
            <div className='flex bg-purple rounded-b-xl rounded-tr-xl p-2 m-3 mt-0 break-words shadow-xl'>
              <p className=" "> {props.message}</p>
            </div>
          </div>
        </div> :
        <div className="flex flex-row-reverse ">
          <div className="grid max-w-[70%]">
            <div className="flex flex-row-reverse p-3 pb-0" >
              <p className="text-purple-tone-2 font-bold"> {props.username} </p>
            </div>
            <div className='flex bg-purple-sh-2 rounded-b-xl rounded-tl-xl p-2 m-3 mt-0 break-words shadow-xl'>
              <p className=""> {props.message}</p>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default Bubble
