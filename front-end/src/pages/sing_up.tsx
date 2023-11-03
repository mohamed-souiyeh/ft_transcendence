
import logo from '../assets/Group.svg'
import google from '../assets/google.svg'
import intra from '../assets/42.svg'

import { Link} from "react-router-dom";

function SingUp () {
  return (
    <>

      <div className="w-screen h-screen grid place-content-center">
        <div className="grid place-content-center">
          <img src={logo}/>
        </div>
        <div className="grid place-content-center py-2">
          <h1 className='text-impure-white'>Sign up</h1>
        </div>

        <div className='py-2'>
          <button  className="flex border-purple-tone-1 bg-transparent rounded-lg border-2 w-l-card-w hover:border-purple-tone-1">
            <div>
              <img className='flex-none pr-3' src={google} />
            </div>
            <div>
              <p className='flex-1 text-purple-tone-1'> Continue With Google</p>
            </div>

          </button>
        </div>

        <div className='py-2'>
          <button  className="flex border-purple-tone-1 bg-transparent rounded-lg border-2 w-l-card-w hover:border-purple-tone-1">
            <div>
              <img className='flex-none pr-3' src={intra} />
            </div>
            <div>
              <p className='flex-1 text-purple-tone-1'> Continue With Intranet</p>
            </div>

          </button>
        </div>

        <div className='py-2 w-l-card-w flex flex-row-reverse'>
          <div>
            <Link className=' px-1 text-white font-bold hover:text-purple-sh-2' to="/login"> Sign in! </Link>
          </div>
          <div>
            <p className='text-purple-tone-1'> already have an account?</p>
          </div>

        </div>
      </div>     
    </>
  )
}


export default SingUp;


