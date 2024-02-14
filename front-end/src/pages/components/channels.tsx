import { useChannelContext } from "../../contexts/channelContext"
import GroupsIcons from "./groupsIcons"

const mokChannel = {
  "id": 1,
  "type": "public",
  "channelName": "hazimo ra3d",
  "channelImage": "",
  "channelDescription": "an epic place to be in",
  "channelPassword": null,
  "ownerId": 0,
  "createdAt": "2024-01-16T13:55:37.481Z",
  "users": [
    {
      "id": 5,
      "username": "slave 3"
    },
    {
      "id": 4,
      "username": "slave 2"
    },
    {
      "id": 3,
      "username": "slave 1"
    },
    {
      "id": 2,
      "username": "msouiyeh"
    },
    {
      "id": 1,
      "username": "mohamed"
    }
  ],
  "usersState": [
    {
      "id": 1,
      "state": "active",
      "role": "owner",
      "untile": null,
      "userId": 1,
      "channelId": 1
    },
    {
      "id": 2,
      "state": "active",
      "role": "modirator",
      "untile": null,
      "userId": 2,
      "channelId": 1
    },
    {
      "id": 3,
      "state": "active",
      "role": "user",
      "untile": null,
      "userId": 3,
      "channelId": 1
    }
  ]
};

type channelType = typeof mokChannel;

function Channels(props: object) {
  const { channel, setChannel } = useChannelContext()
  const currentChannel: channelType = props.currentChannel;
  const { setRefreshChannels } = props;


  // useEffect(() => {
  // }, [channel]);

  const clicked = () => {
    setChannel(currentChannel)
  }

  return (
    <div className={` ${channel.name === currentChannel.channelName ? 'bg-purple-sh-0' : 'bg-transparent'} flex border border-transparent border-b-purple-sh-0 p-4`} onClick={() => clicked()}>
      <div className='flex basis-2/3 hover:cursor-pointer'>
        <div className="grid px-2">
          <div className="flex flex-col gap-1 align-bottom justify-center items-baseline">
            <p className="text-xl font-bold text-purple-tone-2"> {currentChannel.channelName} </p>
            <p className="text-sm text-impure-white/40  truncate"> {currentChannel.type} </p>
          </div>
          <p className="text-sm text-impure-white/40  truncate"> {currentChannel.channelDescription} </p>
        </div>
      </div>
      <div className='flex flex-row-reverse basis-1/3 self-center'>
        <GroupsIcons channel={currentChannel} refreshChannels={setRefreshChannels}/>
      </div>
    </div>
  )

}

export default Channels
