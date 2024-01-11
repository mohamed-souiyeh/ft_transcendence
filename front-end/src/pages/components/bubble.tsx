import { useDmContext } from "../../contexts/chatContext"
import img from '../../assets/taha.jpg'
import bot from '../../assets/bot.png'

function Bubble() {

  const {dm} = useDmContext();

  // a tiny condition is needed to define which bubble will be shown
  return (
    <>
      <div className="flex max-w-[80%] ">
        <img className="h-10 w-10 rounded-full self-center" src={img}/>
        <div className='bg-purple rounded-t-xl rounded-br-xl p-2 m-3 break-words max-w-[80%] shadow-xl'>
          <p className=" text-clip"> { dm.message }</p>
        </div>
      </div>
      <div className="flex flex-row-reverse basis-1/12 ">
        <img className="h-10 w-10 rounded-full self-center" src={bot}/>
        <div className='bg-purple-sh-2 rounded-t-xl rounded-bl-xl p-2 m-3 break-words max-w-[60%] shadow-xl'>
          <p className=" text-clip"> { dm.message }</p>
        </div>
      </div>
    </>
  )
}

export default Bubble
