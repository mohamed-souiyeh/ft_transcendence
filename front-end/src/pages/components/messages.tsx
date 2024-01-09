import img from "../../assets/taha.jpg"
import { useEffect } from "react"
import { useDmContext } from "../../contexts/chatContext"
import Icons from "./icons"
import Bubble from "./bubble"

function Messages() {

  const {dm} = useDmContext()
  useEffect(() => {
    dm ? console.log("we hav smth") : console.log("we ain't got shit")

  }, [dm])


  return (
    <div className="bg-purple-sh-1 h-[100%] pb-10 ">
      <div className="flex sticky bg-purple-s-0 w-[100%] border border-transparent border-b-purple-sh-2 p-5 ">
        <div className="basis-11/12 flex">
          <img src={img} className="h-14 w-14 rounded-full" />
          <div className="grid px-3 ">
            <p className="text-xl font-bold text-purple-tone-2"> {dm.name} </p>
            <p className="text-impure-white/40  truncate"> status </p>
          </div>
        </div>
        <div className="flex flex-row-reverse self-center basis-1/12" >
          <Icons/>
        </div>
      </div>

      <div className="h-[87%] overflow-scroll scrollbar-thin scrollbar-thumb-purple-sh-0 ">
        <Bubble/>
      </div>
      <div className="fixed bottom-5 bg-purple-sh-0 w-[66%] h-12 m-2 rounded-lg px-2">
        <form >
          <input type='text' placeholder="send a Messages" className='w-[440px] h-12 bg-transparent outline-none rounded-lg text-impure-white px-2 place-self-center' />

        </form >
      </div>
    </div>
  )
}

export default Messages
