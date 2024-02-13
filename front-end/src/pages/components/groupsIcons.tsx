import { Menu, MenuHandler, MenuList, MenuItem} from "@material-tailwind/react";
import { useContext, useEffect, useRef, useState } from "react"
import { UserContext } from "../../App";
import { usePwdPopupContext } from "../../contexts/pwdPopupContext";
import { useAddFriendsPopupContext } from "../../contexts/addFriendsPopupContext";

function GroupsIcons(props: object) {
  
  const { channel, refreshChannels } = props;
  const { user } = useContext(UserContext);
  const { setPwdPopup} = usePwdPopupContext()
  const {setAddFriendsPopup} = useAddFriendsPopupContext()

  const isOwner = channel.usersState.find((userState: any) => userState.userId === user.data.id)?.role === 'owner'; 
  const isAdmin = channel.usersState.find((userState: any) => userState.userId === user.data.id)?.role === 'modirator';

  // console.log("isOwner: ", isOwner);
  // console.log("isAdmin: ", isAdmin);
  // console.log("user: ", user);
  // console.log("channel: ", channel);

  const leaveGroup = () => {
    if (user.chat) {
      user.chat.emit('leaveChannel', {
        convId: channel.id,
        convType: channel.type,
      });
      refreshChannels(true);
      console.log("I'm outta here")
    }
  }

  const addMembers = () => {
    console.log("Add Members, iwa this one needs a page or popup as well")
    setAddFriendsPopup(true)
  }

  const passwordSettings = () => {
    setPwdPopup(true)
    console.log('add, remove or edit Password')
  }

  return (
    <Menu>
      <MenuHandler>
        <button className="bg-transparent">
          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="23" viewBox="0 0 8 23" fill="none">
            <path d="M0.820641 2.84711C0.820641 1.27359 2.09352 0 3.66631 0C5.23911 0 6.5127 1.27216 6.5127 2.84711C6.5127 4.41775 5.24126 5.69278 3.66631 5.69278C2.09352 5.69278 0.820641 4.41775 0.820641 2.84711ZM0.820641 11.6474C0.820641 10.0775 2.0928 8.80034 3.66559 8.80034C5.23839 8.80034 6.51198 10.0761 6.51198 11.6474C6.51198 13.2188 5.24054 14.496 3.66559 14.496C2.09351 14.4946 0.820641 13.2188 0.820641 11.6474ZM0.820641 20.155C0.820641 18.5823 2.09352 17.3072 3.66703 17.3072C5.23839 17.3072 6.51198 18.5801 6.51198 20.155C6.51198 21.725 5.24054 23 3.66703 23C2.09352 23 0.820641 21.725 0.820641 20.155Z" fill="#8176AF"/>
            <defs>
              <clipPath id="clip0_1311_182">
                <rect width="23" height="7" fill="white" transform="matrix(0 1 1 0 0.0833359 0)"/>
              </clipPath>
            </defs>
          </svg>
        </button>
      </MenuHandler>
      <MenuList className="bg-purple-sh-2 border border-purple">
        <MenuItem onClick={() => {leaveGroup()}} className="text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">Leave Group</MenuItem>
        { (isAdmin || isOwner) &&  <MenuItem onClick={() => {addMembers()}} className="text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">Add Members</MenuItem> }
        { isOwner && <MenuItem onClick={() => {passwordSettings()}} className="text-purple-tone-2 hover:bg-purple-sh-0 hover:text-purple-tone-2">Privacy Settings</MenuItem> }
      </MenuList>
    </Menu>
  )
}

export default GroupsIcons;
