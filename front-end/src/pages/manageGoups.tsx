import { useEffect, useRef, useState } from "react";
import Groups from "./components/groups";
import SideBar from "./components/sidebar";
import GroupMembers from "./components/groupMembers";

function ManageGoups() {
  const [badInput, setBadInput] = useState({
    badName: false,
    badPwd: false,
    badPrv:false,
    badMembers:false,
  })
  const [val, setVal] = useState("")
  const [state, setState] = useState(false)
  const menuRef = useRef(null);
  const [confirmationPwd, setConfirmationPwd] = useState("")
  const [createdGroup, setCreatedGroup] = useState({
    name: "",
    privacy:"",
    password:"",
    description: "",
    members: [],
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreatedGroup((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setState(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const setPrivacy = (prv : string) => {
    setCreatedGroup({...createdGroup, privacy: prv} )
    setState(false)

  }

  const getGroups = (e : React.FormEvent) => {
    e.preventDefault()
    console.log("list em", val)
    if(!val)
    console.log("no Value provided")
  }


  const openOptions = () => {
    setState(!state)
  }

  const handleSubmit = (e : React.FormEvent) => {
    e.preventDefault()
    console.log("submitting some data..")
    console.log("_name:",createdGroup.name,'privacy:', createdGroup.privacy,'desc:', createdGroup.description)
    console.log("pwd:",createdGroup.password, 'conf pwd:', confirmationPwd, 'members:', createdGroup.members)
    if(!Object.keys(createdGroup.members).length){
      setBadInput({...badInput, badMembers: true})
    }
    if(createdGroup.privacy === "Protected" && (createdGroup.password != confirmationPwd || !createdGroup.password)) {
      setBadInput({...badInput, badPwd: true})
    }
    if(!createdGroup.privacy) {
      setBadInput({...badInput, badPrv: true})
    }
    if(!createdGroup.name) {
      setBadInput({...badInput, badName: true})
    }
  }

  var FakeData = [
    {groupName: "One", privacy: "Protected", joined: false, id: 0},
    {groupName: "Two", privacy: "Public", joined: false, id: 1},
    {groupName: "Three", privacy: "Public", joined: false, id: 2},
    {groupName: "Four", privacy: "Public", joined: false, id: 3},
  ]

  return (
    <>
      <SideBar/>
      {/* --------------------------------{ JOIN  a Group }----------------------------------- */}
      <div className="h-screen w-screen bg-gradient-to-br from-purple-sh-2 from-10% via-purple-sh-1 via-30% to-purple flex gap-10 justify-center items-center">
        <div className="basis-1/4 h-[80%] ">
          <p className="text-impure-white text-5xl pb-3"> Join a Group </p>
          <div className="bg-purple-sh-2 rounded-lg h-[90%] w-full overflow-y-scroll scrollbar-thin scrollbar-thumb-purple-sh-1 p-4">

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


        {/* --------------------------------------------------{ Create a Group }---------------------------------------------------- */}
        <div className="basis-2/4 h-[80%] ">
          <form onSubmit={handleSubmit} className="h-full">
            <p className="text-impure-white text-5xl pb-3"> Create a Group </p>
            <div className="flex bg-purple-sh-2 rounded-lg h-[90%] p-6">

              <div className="flex-col h-full p-4 basis-1/2 " >
                <p className="text-2xl" > Group Name: </p>
                <input type="text" name="name" value={createdGroup.name} onChange={handleInputChange} placeholder="group name" className="bg-purple-sh-0 rounded-lg w-72 placeholder:text-impure-white/30 focus:outline-none p-2" /> 
                { badInput.badName && <p className="text-[#D9534F] font-bold text-sm" > Please Enter a valid name</p> }

                <p className="text-2xl pt-3" > privacy: </p>
                <div ref={menuRef} onClick={() => {openOptions()}} className=" bg-purple-sh-0 flex items-center rounded-lg p-2 hover:cursor-pointer w-72">
                  <div className="basis-11/12">
                    {createdGroup.privacy ?  <p className="text-impure-white text-lg"> {createdGroup.privacy } </p> : <p className="text-impure-white/30 text-md"> click to select</p>}
                  </div>
                  <div className="basis-1/12">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                      <path d="M7 8L0.0717964 0.5L13.9282 0.5L7 8Z" fill="#201E2D"/>
                    </svg>
                  </div>
                </div>
                { badInput.badPrv && <p className="text-[#D9534F] font-bold text-sm" > Please choose privacy </p> }
                { state && 
                  <div ref={menuRef} className="border border-purple  shadow-xl shadow-purple-sh-2 bg-purple-sh-0 rounded-lg mt-1 absolute w-72">
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

                { createdGroup.privacy === "Protected" &&                 
                  <div >
                    <p className="text-2xl pt-3" > Password: </p>
                    <input type="password" name="password" placeholder="enter password" onChange={handleInputChange} className="bg-purple-sh-0 rounded-lg w-72 h-12 focus:outline-none p-2 placeholder:text-impure-white/30 " />
                    <p className="text-2xl pt-3" > confirm Password: </p>
                    <input type="password" name="confirmedPassword" placeholder="re-enter password" onChange={(e) => {setConfirmationPwd(e.target.value)}} className="bg-purple-sh-0 rounded-lg w-72 h-12 focus:outline-none p-2 placeholder:text-impure-white/30 " />
                    { badInput.badPwd && <p className="text-[#D9534F] font-bold text-sm" > Bad Password</p> }
                  </div>
                }
                <p className="text-2xl pt-3" > description: </p>
                <textarea name="description" value={createdGroup.description}  onChange={handleInputChange} className="bg-purple-sh-0 rounded-lg  focus:outline-none p-2" cols={35} rows={4} />
                <div className="flex w-full place-content-center pt-3">
                  <button type="submit" className="bg-purple-sh-1 hover:bg-purple-sh-0 rounded-lg object-center w-[60%]"> Create Group </button>
                </div>

              </div>
              <div className="flex-col h-full p-4 basis-1/2 " >
                <p className="text-2xl" > Add Members: </p>
                <div className="border-4 rounded-lg border-purple-sh-1 h-[80%] overflow-y-scroll scrollbar-thin scrollbar-thumb-purple-sh-0 p-4">
                  {/* <div className={`grid w-[100%] ${ !FakeData.length && 'place-content-center'}  `}> */}
                    {/* {FakeData.length ? FakeData.map((grp) => <GroupMembers userName={grp.groupName} added={grp.joined} key={grp.id}/>) : <p className="text-xl text-purple/50 p-5"> You have no friends </p>} */}
                  <GroupMembers createdGroup={createdGroup} setCreatedGroup={setCreatedGroup}/>
                  {/* </div> */}
                </div>
                    {badInput.badMembers && <p className="text-[#D9534F] pl-1 font-bold text-sm" > Please add some members </p> }
              </div>

            </div>
          </form>
        </div>

      </div>
    </>
  )
}

export default ManageGoups
