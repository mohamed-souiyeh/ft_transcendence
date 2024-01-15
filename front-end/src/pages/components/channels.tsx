import { useChannelContext } from "../../contexts/channelContext"
import { MenuDefault } from "./menuDefault"




function Channels (contact:object) {

  const {channel, setChannel} = useChannelContext()

  const clicked = () => {
    console.log("channel clicked")
    setChannel(contact)
  }

  return (
    <div className={` ${channel.name === contact.name ? 'bg-purple-sh-0' : 'bg-transparent'} flex border border-transparent border-b-purple-sh-0 p-4`}>
      <div className='flex basis-2/3 hover:cursor-pointer' onClick={() => clicked()}>
        <div className="grid px-2">
          <p className="text-xl font-bold text-purple-tone-2"> {contact.name} </p>
          <p className="text-sm text-impure-white/40  truncate"> {contact.message} </p>
        </div>
      </div>
      <div className='flex flex-row-reverse basis-1/3 self-center'>
        <MenuDefault/>
      </div>
    </div>
  )
}

export default Channels
