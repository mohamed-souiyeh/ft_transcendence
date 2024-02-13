import { useNavigate } from "react-router-dom";
import { useChannelContext } from "../../contexts/channelContext"
import { UserContext } from "../../App";
import { useContext, useState } from "react";
import { Menu, MenuHandler, MenuList, MenuItem, Button, } from "@material-tailwind/react";


                        {/* <MenuItem onClick={() => { ban() }} className="text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">Ban user</MenuItem> */}

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

  const ban = (duration: number) => {
    if (user.chat) {
      const now: Date = new Date();

      duration == 1 ? now.setMinutes(now.getMinutes() + 1) : (duration == 2 ? now.setMinutes(now.getMinutes() + 10) : now.setFullYear(now.getFullYear() + 1000000))

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

  const mute = (duration: number) => {
    if (user.chat) {
      const now: Date = new Date();

      //that is the only line we have to change, read docs
      duration == 1 ? now.setMinutes(now.getMinutes() + 1) : (duration == 2 ? now.setMinutes(now.getMinutes() + 10) : now.setFullYear(now.getFullYear() + 1000000))

      console.log("aaaaaaaaaa: ", now.toISOString())
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

    const [openMenu, setOpenMenu] = useState(false);
    const [openMute, setOpenMute] = useState(false);


  return (
    <>
      {props.left ?
        <div className="flex ">
          <div className="grid max-w-[70%]">
            <div className="flex p-3 pb-0" >
              {/* make username clickable */}
              {Object.keys(channel).length && props.authorInfo?.role !== "kicked" ?

                <Menu>
                  <MenuHandler >
                    <button className="bg-transparent p-0 m-0 border-none outline-none">
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
                        : 
                        <Menu placement="right-start" open={openMenu} handler={setOpenMenu} allowHover offset={15} >
                          <MenuHandler className="flex items-center justify-between text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">
                            <MenuItem >
                              Ban for
                              <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
                                <path d="M7.99951 7.00098L0.499512 13.9292V0.0727734L7.99951 7.00098Z" fill="#796FA4"/>
                              </svg>
                            </MenuItem>
                          </MenuHandler >
                          <MenuList className="bg-purple-sh-2 border border-purple">
                            <MenuItem  onClick={() => {ban(1)}} className="text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">1 Minute</MenuItem>
                            <MenuItem  onClick={() => {ban(1)}} className="text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">10 Minute</MenuItem>
                            <MenuItem  onClick={() => {ban(1)}} className="text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">Forever</MenuItem>
                          </MenuList>
                        </Menu>


                      )}
                    {
                      (isAdmin && props.authorState !== "banned") &&
                      (props.authorState === "muted" ?
                        <MenuItem onClick={() => { unmute() }} className="text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">unmute user</MenuItem>
                        : 

                        <Menu placement="right-start" open={openMute} handler={setOpenMute} allowHover offset={15} >
                          <MenuHandler className="flex items-center justify-between text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">
                            <MenuItem >
                              Mute for
                              <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
                                <path d="M7.99951 7.00098L0.499512 13.9292V0.0727734L7.99951 7.00098Z" fill="#796FA4"/>
                              </svg>
                            </MenuItem>
                          </MenuHandler >
                          <MenuList className="bg-purple-sh-2 border border-purple">
                            <MenuItem onClick={() => {mute(1)}} className="text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">1 Minute</MenuItem>
                            <MenuItem onClick={() => {mute(2)}} className="text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">10 Minute</MenuItem>
                            <MenuItem onClick={() => {mute(3)}} className="text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">Forever</MenuItem>
                          </MenuList>
                        </Menu>


                        )}

                          {/* <MenuItem onClick={() => { mute() }} className="text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">Mute for 10 mins</MenuItem> */}


                    {isAdmin && <MenuItem onClick={() => { kickUser() }} className="text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">Kick user</MenuItem>}
                  </MenuList>
                </Menu>
                :
                <p className="text-purple-tone-2 font-bold"> {
                  props.authorInfo?.role === "kicked" ?
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

export default Bubble;
