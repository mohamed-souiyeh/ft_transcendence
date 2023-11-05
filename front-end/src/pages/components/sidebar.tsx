import { Link } from 'react-router-dom'
import usr from '../../assets/user.svg'
import home from  '../../assets/home.svg'
import exit from '../../assets/exit.svg' 

function SideBar () {
  return(
  <>
      <div className="bg-purple-sh-2 w-14 h-48 rounded-r-[22px] left-0 inset-y-1/3 absolute grid place-content-center "> 
          <Link  to="/home"> <img className='py-2' src={home}/> </Link>
          <Link to="/profile" > <img className='py-2' src={usr}/> </Link>
          <Link to="/login" > <img className='py-2' src={exit}/> </Link>


      </div> 
  </>
  )
}

export default SideBar
