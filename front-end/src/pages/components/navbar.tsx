import { Link } from 'react-router-dom'
import { useAvatarContext } from '../../contexts/avatar'
import { useNotificationContext } from '../../contexts/notificationContext'

function NavBar() {
  const {avatar} = useAvatarContext()
  const {notification} = useNotificationContext()
  return (
    <>
      <div className="absolute top-0 right-0 flex gap-1">

        <Link to = "/search">
          <div className=" h-12 w-12 bg-purple-sh-2 grid place-content-center  rounded-full">
            <svg className="h-8 w-8 cursor-pointer stroke-purple stroke-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
        </Link>

        <Link to = "/chat">
          <div className=" h-12 w-12 bg-purple-sh-2 grid place-content-center  rounded-full">
          {notification &&  <div className='h-3 w-3 rounded-full bg-red-500 absolute m-px'> </div> }
            <svg className="h-9 w-9 cursor-pointer stroke-purple stroke-[1.5px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </div>
        </Link>

        <Link to = "/profile">
          <div className=" h-12 w-12 grid place-content-center ">
            <img className="h-11 w-11 rounded-full" src={avatar}/>
          </div>
        </Link>

      </div>
    </>
  )

}

export default NavBar
