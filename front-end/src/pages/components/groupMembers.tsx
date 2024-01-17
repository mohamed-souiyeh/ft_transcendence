
function GroupMembers(props) {

  const addMember = () => {
    console.log("add to members list")
  }

  const removeMember = () => {
    console.log("Remove from list ")
  }

  return (
    <div className='flex bg-purple-sh-1 my-2 mx-3 rounded-lg'>
      <div className='basis-2/3 m-2'>
          <p className='text-xl pl-3 pt-2'> {props.userName} </p>
      </div>
      <div className='flex flex-row-reverse m-3 basis-1/3 items-center'>
        {props.added ? 
         <button onClick={() => removeMember()} className="rounded-lg bg-purple-sh-2 h-10 w-28"> added </button> : 
        <button onClick={() => addMember()} className="rounded-lg bg-purple h-10 w-28"> add </button>
        }
      </div>
    </div>
  )
}

export default GroupMembers
