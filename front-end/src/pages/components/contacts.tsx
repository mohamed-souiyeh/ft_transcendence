import Icons from "./icons"
import img from "../../assets/taha.jpg"
import {useDmContext} from "../../contexts/chatContext.tsx"

function Contacts(props) {

  const {dm, setDm} = useDmContext();

  const { user } = props;

  console.log("this is the user in contacts :", user);

  const clicked = () => {
    setDm(user)
  }

  return (
    <div className={` ${dm.username === user.username ? 'bg-purple-sh-0' : 'bg-transparent'} flex border border-transparent border-b-purple-sh-0 p-4`}>
      <div className='flex basis-11/12 hover:cursor-pointer' onClick={() => clicked()}>
        <img src={img} className="rounded-full h-12 w-12" />
        <div className="grid px-2">
          <p className="text-xl font-bold text-purple-tone-2"> {user.username} </p>
          {/* <p className="text-sm text-impure-white/40  truncate"> {contact.message} </p> */}
        </div>
      </div>
      <div className='flex flex-row-reverse basis-1/12 self-center'>
        <Icons/>
      </div>
    </div>
  )
}

export default Contacts
