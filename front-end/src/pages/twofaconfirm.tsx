import logo from '../assets/Logo.svg'

function TwoFAConfirmation () {
  return (
    <>

      <div className="w-screen h-screen grid place-content-center">
        <div className="grid place-content-center">
          <img className='w-32 h-32' src={logo}/>
        </div>
        <div className="grid place-content-center pt-2">
          <h1 className='text-purple-tone-1'>2FA authentication</h1>
        </div>
        <div className="grid place-content-end pb-2">
          <p className='text-purple-tone-2 text-xs'> Please open Google's Authenticator App and Enter the code below</p>
        </div>

        <form className='grid place-content-center pt-8'>
          <input type='text' name="verfCode" placeholder="Enter 6 digits code" className='w-[440px] h-12 bg-purple-sh-2 outline-none rounded-lg text-impure-white px-2 place-self-center' />
          <div className='grid place-content-center p-3'>
          <button className="w-[440px] rounded-lg bg-purple focus:outline-none border-none hover:bg-purple-sh-2"  type="submit" value="Send" > Confirm </button>
          </div>
        </form >

        <div className="flex ">
          <p className='text-purple-tone-2 text-xs pl-3 pr-1'> can't access your code? sounds like a </p>
          <p className='text-purple-sh-2 text-xs font-bold'> YOUUU problem!</p>
        </div>
      </div>     
    </>
  )
}


export default TwoFAConfirmation;
