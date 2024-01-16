
function Groups(props) {

  const joinGroup = () => {
    console.log("joiiiin")
  }

  const leaveGroup = () => {
    console.log("outta here")
  }

  return (
    <div className='flex bg-purple-sh-1 my-2 mx-3 rounded-lg'>
      <div className='basis-2/3 m-2'>
        <div className='grid'>
          <p className='text-xl pl-3 pt-2'> {props.groupName} </p>
          <p className='text-sm pl-3 pb-2 pt-1 text-impure-white/40'> {props.privacy} </p>
        </div>
      </div>
      <div className='flex flex-row-reverse m-3 basis-1/3 items-center'>
        {props.joined ? 
         <button onClick={() => leaveGroup()} className="rounded-lg bg-purple-sh-2 h-10 w-28"> Joined </button> : 
        <button onClick={() => joinGroup()} className="rounded-lg bg-purple h-10 w-28"> Join </button>
        }
      </div>
    </div>
  )
}

export default Groups
