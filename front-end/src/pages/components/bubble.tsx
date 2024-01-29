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
  let isAdmin = false;

  // console.log("userInfo: ", props.authorInfo);
  // console.log("userState: ", props.authorState);


  if (Object.keys(channel).length) {
    isAdmin = (channel.usersState.find(fuser => fuser.userId === user.data.id)?.role === "modirator" || channel.usersState.find(fuser => fuser.userId === user.data.id)?.role === "owner") && !isBanned;

  }

  const visitProfile = () => {
    navigate('/' + props.username)
  }

  const setAsAdmin = () => {

    if (user.chat) {
      user.chat.emit('giveAdminRole', {
        convType: channel.type,
        convId: channel.id,
        targetedUserId: props.authorInfo.id,
      });
    }
  }

  const removeAdmin = () => {
    if (user.chat) {
      user.chat.emit('removeAdminRole', {
        convType: channel.type,
        convId: channel.id,
        targetedUserId: props.authorInfo.id,
      });
    }
  }


  const kickUser = () => {
    if (user.chat) {
      user.chat.emit('kickUser', {
        convType: channel.type,
        convId: channel.id,
        targetedUserId: props.authorInfo.id,
      });
    }
  }

  const ban = () => {
    if (user.chat) {
      const now: Date = new Date();

      now.setFullYear(now.getFullYear() + 1);


      user.chat.emit('banUser', {
        convType: channel.type,
        convId: channel.id,
        targetedUserId: props.authorInfo.id,
        until: now.toISOString(),
      });
    }
  }

  const unban = () => {
    if (user.chat) {
      user.chat.emit('unbanUser', {
        convType: channel.type,
        convId: channel.id,
        targetedUserId: props.authorInfo.id,
      });
    }
  }

  const mute = () => {
    if (user.chat) {
      const now: Date = new Date();

      now.setFullYear(now.getFullYear() + 1);

      user.chat.emit('muteUser', {
        convType: channel.type,
        convId: channel.id,
        targetedUserId: props.authorInfo.id,
        until: now.toISOString(),
      });
    }
  }

  const unmute = () => {
    if (user.chat) {
      user.chat.emit('unmuteUser', {
        convType: channel.type,
        convId: channel.id,
        targetedUserId: props.authorInfo.id,
      });
    } console.log("unmuted");
  }

  return (
    <>
      {props.left ?
        <div className="flex ">
          <div className="grid max-w-[70%]">
            <div className="flex p-3 pb-0" >
              {/* make username clickable */}
              {Object.keys(channel).length && props.authorInfo.role !== "kicked" ?

                <Menu>
                  <MenuHandler>
                    <button className="bg-transparent p-0 m-0">
                      {props.username}
                    </button>
                  </MenuHandler>
                  <MenuList className="bg-purple-sh-2 border border-purple">
                    <MenuItem onClick={() => { visitProfile() }} className="text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">Visit profile</MenuItem>
                    {isAdmin &&
                      (props.authorInfo.role === "modirator" ?
                        <MenuItem onClick={() => { removeAdmin() }} className="text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">Remove admin</MenuItem>
                        : <MenuItem onClick={() => { setAsAdmin() }} className="text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">Set as admin</MenuItem>)}
                    {isAdmin &&
                      (props.authorState === "banned" ?
                        <MenuItem onClick={() => { unban() }} className="text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">unban user</MenuItem>
                        : <MenuItem onClick={() => { ban() }} className="text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">Ban user</MenuItem>)
                    }
                    {
                      (isAdmin && props.authorState !== "banned") &&
                      (props.authorState === "muted" ?
                        <MenuItem onClick={() => { unmute() }} className="text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">unmute user</MenuItem>
                        : <MenuItem onClick={() => { mute() }} className="text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">Mute for 10 mins</MenuItem>)
                    }



                    {isAdmin && <MenuItem onClick={() => { kickUser() }} className="text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">Kick user</MenuItem>}
                  </MenuList>
                </Menu>
                :
                <p className="text-purple-tone-2 font-bold"> {
                  props.authorInfo.role === "kicked" ?
                    `kicked user (${props.username})`
                    :
                  props.username} </p>
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
