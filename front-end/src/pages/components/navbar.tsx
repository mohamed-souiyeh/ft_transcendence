import pic from '../../assets/taha.jpg'

function NavBar() {
  return (
    <>
      <div className="absolute top-0 right-0 flex">

        {/* <div className="absolute top-0 right-0 inline-grid grid-cols-3 gap-1 "> */}

        {/* <div className=" h-22 w-22 bg-purple-sh-1 grid place-content-center  rounded-full"> */}
        {/*     <svg className="hover:stroke-2 hover:stroke-[#A69BD4] h-10 w-10 stroke-purple stroke-[1.5px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> */}
        {/*       <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /> */}
        {/*     </svg> */}
        {/* </div> */}

        <div className=" mx-auto h-12 bg-purple-sh-1 rounded-full grid place-content-center overflow-hidden ">

          <form action='' className="relative mx-auto w-max">
            {/* <input type='search' className='peer hover:w-56 pl-4 focus:w-56 w-12 bg-transparent  border-transparent outline-none ' /> */}
            <input type='search' className='w-12 h-12 bg-transparent border-transparent outline-none text-transparent focus:text-impure-white relative z-10 focus:w-48 pr-8 focus:pl-4' />

            <svg className="w-10 h-10 absolute stroke-purple inset-y-0 right-0 pr-2 pt-2 stroke-[1.5px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              {/* <svg className="focus:stroke-2  focus:stroke-[#A69BD4] h-10 w-10 stroke-purple stroke-[1.5px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> */}
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>

          </form>
        </div>
        <div className=" h-12 w-12 bg-purple-sh-1 grid place-content-center  rounded-full">
          <svg className="hover:stroke-2 hover:stroke-[#A69BD4] h-11 w-11 stroke-purple stroke-[1.5px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" >
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        </div>

        <div className=" h-12 w-12 bg-purple-sh-1 grid place-content-center  rounded-full">
          <img className="h-10 w-10 rounded-full hover:h-12 hover:w-12 " src={pic}/>
        </div>


      </div>
    </>
  )

}

export default NavBar
