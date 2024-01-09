import Icons from "./icons"
import img from "../../assets/taha.jpg"
import {useDmContext} from "../../contexts/chatContext.tsx"

function Contacts(contact:object) {

  const {setDm} = useDmContext()

  const clicked = () => {
    setDm(contact)
  }

  return (
    <div className='flex border border-transparent border-b-purple-sh-0 py-2 m-4'>
    <div className='flex basis-11/12 hover:cursor-pointer' onClick={() => clicked()}>
        <img src={img} className="rounded-full h-12 w-12" />
        <div className="grid px-2">
          <p className="text-xl font-bold text-purple-tone-2"> {contact.name} </p>
          <p className="text-sm text-impure-white/40  truncate"> {contact.message} </p>
        </div>
    </div>
    <div className='flex flex-row-reverse basis-1/12 self-center'>
        <Icons/>
    </div>
    </div>
  )
}

export default Contacts
