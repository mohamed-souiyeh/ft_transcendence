import { useEffect, useRef, useState } from "react";
import Groups from "./components/groups";
import SideBar from "./components/sidebar";
import GroupMembers from "./components/groupMembers";

function ManageGoups() {
  const [val, setVal] = useState("")
  const [friend, setFriend] = useState("")
  const [state, setState] = useState(false)
  const [privacy, setPrivacyState] = useState("")
  const menuRef = useRef(null);

   useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setState(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const setPrivacy = (prv : string) => {
    setPrivacyState(prv)
    setState(false)
    console.log("ehm", prv, privacy)
  }

  const getGroups = (e : React.FormEvent) => {
    e.preventDefault()
    console.log("list em", val)
    if(!val)
    console.log("no Value provided")
  }

  const getFriend = (e : React.FormEvent) => {
    e.preventDefault()
    console.log("get friends that match input", friend)
    if(!friend)
    console.log("no friend name entered ")
  }

  const openOptions = () => {
    setState(!state)
    console.log('OPENNE', privacy)
  }
  const FakeData = [
    {groupName: "One", privacy: "Protected", joined: true, id: 0},
    {groupName: "Two", privacy: "Public", joined: false, id: 1}
  ]

  return (
    <>
      <SideBar/>
      <div className="h-screen w-screen bg-gradient-to-br from-purple-sh-2 from-10% via-purple-sh-1 via-30% to-purple flex gap-10 justify-center items-center">
        <div className="basis-1/4 h-[80%] ">
          <p className="text-impure-white text-5xl pb-3"> Join a Group </p>
          <div className="bg-purple-sh-2 rounded-lg h-[90%] w-full">

            <div className="flex flex-row-reverse py-2" >
              <form onSubmit={getGroups} className="flex bg-purple-sh-0 rounded-lg items-center m-3">
                <svg className="w-10 h-10 stroke-purple stroke-2 " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input onChange={(e) => setVal(e.target.value)} type='text' placeholder="search for a group" className='h-12 p-3 bg-transparent cursor-text border-transparent outline-none placeholder:italic placeholder:text-purple/60'/>
              </form>
            </div>

            <div className={`grid w-[100%] ${ !FakeData.length && 'place-content-center'}`}>
              {FakeData.length ? FakeData.map((grp) => <Groups groupName={grp.groupName} privacy={grp.privacy} joined={grp.joined} key={grp.id}/>) : <p className="text-xl text-purple/50 p-5"> search for a group </p>}
            </div>

          </div>
        </div>

        <div className="basis-2/4 h-[80%] ">
          <p className="text-impure-white text-5xl pb-3"> Create a Group </p>
          <div className="flex bg-purple-sh-2 rounded-lg h-[90%] p-6">

            <div className="flex-col h-full p-4 basis-1/2 " >
              <p className="text-2xl" > group Name: </p>
              <p className="text-2xl" > privacy: </p>
              <div ref={menuRef} onClick={() => {openOptions()}} className="border border-purple bg-purple-sh-0 flex items-center rounded-lg p-2 hover:cursor-pointer w-72">
                <div className="basis-11/12">
                  <p className="text-impure-white/30 text-lg">{privacy ? privacy : 'Click to select'} </p>
                </div>
                <div className="basis-1/12">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                    <path d="M7 8L0.0717964 0.5L13.9282 0.5L7 8Z" fill="#201E2D"/>
                  </svg>
                </div>
              </div>
              { state && 
              <div ref={menuRef} className="bg-purple-sh-0 rounded-lg mt-1 absolute w-72">
                <div onClick={() => {setPrivacy("Public")}} className="hover:bg-purple-sh-1 hover:cursor-pointer rounded-lg p-2">
                  Public
                </div>
                <div onClick={() => {setPrivacy("Protected")}} className="hover:bg-purple-sh-1  hover:cursor-pointer rounded-lg p-2">
                  Protected
                </div>
                <div onClick={() => {setPrivacy("Private")}} className="hover:bg-purple-sh-1 rounded-lg p-2 hover:cursor-pointer ">
                  Private
                </div>
              </div>
              }
              
              { privacy === "Protected" &&                 
              <p className="text-2xl" > Password: </p>
              }
              <p className="text-2xl" > description: </p>

            </div>
            <div className="flex-col h-full p-4 basis-1/2 " >
              <p className="text-2xl" > Add Members: </p>
              <div className="border-4 rounded-lg border-purple-sh-1 h-[80%]">
                <div className="flex flex-row-reverse py-2" >
                  <form onSubmit={getFriend} className="flex bg-purple-sh-0 rounded-lg items-center m-3">
                    <svg className="w-10 h-10 stroke-purple stroke-2 " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input onChange={(e) => setFriend(e.target.value)} type='text' placeholder="Find a friend" className='h-12 p-3 bg-transparent cursor-text border-transparent outline-none placeholder:italic placeholder:text-purple/60'/>
                  </form>
                </div>
                <div className={`grid w-[100%] ${ !FakeData.length && 'place-content-center'}`}>
                  {FakeData.length ? FakeData.map((grp) => <GroupMembers userName={grp.groupName} added={grp.joined} key={grp.id}/>) : <p className="text-xl text-purple/50 p-5"> You have no friends </p>}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  )
}

export default ManageGoups
