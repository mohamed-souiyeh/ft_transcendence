import logo from '../assets/Logo.svg'
import google from '../assets/google.svg'
import intra from '../assets/42.svg'


function googleSignUp()
{
  window.location.href = 'http://localhost:1337/auth/google';
}

function ftSignUp() {
  window.location.href = 'http://localhost:1337/auth/42';
}


function SignUp () {
  return (
    <>

      <div className="w-screen h-screen grid place-content-center">
        <div className="grid place-content-center">
          <img src={logo}/>
        </div>
        <div className="grid place-content-center pt-2">
          <h1 className='text-purple-tone-1'>Welcome</h1>
        </div>
        <div className="grid place-content-end pb-2">
          <p className='text-purple-tone-2 text-sm'> Please choose how to authenticate </p>
        </div>

        <div className='py-2'>
          <button onClick = { ()=> { googleSignUp(); } }
            className="flex border-purple-tone-1 bg-transparent rounded-lg border-2 w-l-card-w hover:border-purple-tone-1 focus:outline-none">
            <div>
              <img className='flex-none pr-3' src={google} />
            </div>
            <div>
              <p className='flex-1 text-purple-tone-1'> Continue With Google</p>
            </div>

          </button>
        </div>

        <div className='py-2'>
          <button 
            onClick = {
              () => {
                ftSignUp();
              }
            }
            className="flex border-purple-tone-1 bg-transparent rounded-lg border-2 w-l-card-w hover:border-purple-tone-1 focus:outline-none">
            <div>
              <img className='flex-none pr-3' src={intra} />
            </div>
            <div>
              <p className='flex-1 text-purple-tone-1'> Continue With Intranet</p>
            </div>

          </button>
        </div>

      </div>     
    </>
  )
}


export default SignUp;


