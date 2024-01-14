import { useEffect } from "react"
import { useChannelContext } from "../../contexts/channelContext"
import { useDmContext } from "../../contexts/chatContext"

function Rooms() {
  const {dm } = useDmContext()
  const {channel} = useChannelContext()

  useEffect(() => {
    channel ? console.log("we hav smth") : console.log("we ain't got shit")

  }, [channel, dm])
  return (

    <>
    <div> hi</div> 
    <p> channel: {channel.name}</p>
    <p> dm : {dm.name}</p>
    </>
  )
}

export default Rooms

