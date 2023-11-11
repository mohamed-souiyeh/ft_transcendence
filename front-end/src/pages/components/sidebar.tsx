import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logout from './logout';

function SideBar () {
  const [openModal, setOpenModal] = useState(true);
  return(
    <>
      <div className="bg-purple-sh-2 w-14 h-48 rounded-r-[22px] left-0 inset-y-1/3 absolute grid place-content-center "> 

        <Link  to="/home"> 
          <div className='py-1'>
            <svg className='stroke-[1.5px] hover:stroke-2 hover:stroke-[#A69BD4] stroke-purple w-12 h-12' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" >
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </div>
        </Link>


        <Link to="/profile" > 
          <div className='py-1'>
            <svg className='stroke-[1.5px] hover:stroke-2 hover:stroke-[#A69BD4]  stroke-purple w-12 h-12' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"  >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
        </Link>


        <div className='py-1'>
          <button className='bg-transparent py-0 px-0 focus:outline-0 border-none' onClick={() => setOpenModal(true)} > 
            <svg className='stroke-[1.5px] hover:stroke-2 stroke-purple hover:stroke-[#A69BD4] w-12 h-12' xmlns="http://www.w3.org/2000/svg" fill='none' viewBox="0 0 24 24" >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
          </button>
          
        </div>

      </div> 
        <Logout open={openModal} onClose={() => setOpenModal(false)}/>
    </>
  )
}

export default SideBar
