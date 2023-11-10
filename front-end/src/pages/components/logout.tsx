import Logo from "../../assets/Logo.svg"
function Logout({open} : {open : boolean})  {
  if (!open) return null
  return (
    <>
      <div className="w-screen h-screen absolute grid place-content-center">
        <div className="h-[500px] w-[400px] bg-purple-tone-2 backdrop-blur-md bg-opacity-10 rounded-[64px]">
          <div className="py-10 grid place-content-center">
            <img src={Logo} />
          </div>
          <div className="grid place-content-center">
            <p className="text-4xl text-center font-bold ">Are you sure you want to logout?</p>
          </div>
          <div className="grid grid-cols-2 place-content-center pt-10 gap-3">
            <button>Yes</button>
            <button>No</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Logout
