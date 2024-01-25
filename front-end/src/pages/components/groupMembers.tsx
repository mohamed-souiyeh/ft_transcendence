import { Dispatch, SetStateAction, useEffect, useState } from "react"

function GroupMembers({createdGroup, setCreatedGroup} : {createdGroup: { name: "", privacy:"", password:"", description: "", members: [], } , setCreatedGroup: Dispatch<SetStateAction<Object>>} ) {

  const FakeData = [
    {Name: "One",   id: 0},
    {Name: "Two",   id: 1},
    {Name: "Three", id: 2},
    {Name: "Four",  id: 3},
  ]

  var [data] = useState(FakeData)




  const addMember = (friend) => {
    friend.added = !friend.added
    setCreatedGroup({...createdGroup, members : [...createdGroup.members, friend] } )
  }

  const removeMember = (friend) => {
    friend.added = !friend.added
    setCreatedGroup({...createdGroup, members: createdGroup.members.filter((elem) => elem != friend)} )
  }


  return (
    <>
      {data.length ? data.map((friend) => (
        <div key={friend.id} className='flex bg-purple-sh-1 my-2 mx-3 rounded-lg'>
          <div className='basis-2/3 m-2'>
            <p className='text-xl pl-3 pt-2'> {friend.Name} </p>
          </div>
          <div className='flex flex-row-reverse m-3 basis-1/3 items-center'>
            {friend.added ? 
              <button type="button" onClick={() => removeMember(friend)} className="rounded-lg bg-purple-sh-2 h-10 w-28"> added </button> : 
              <button type="button" onClick={() => addMember(friend)} className="rounded-lg bg-purple h-10 w-28"> add </button>
            }
          </div>
        </div>
      ))
        :  <p className="text-xl text-purple/50 p-5"> You have no friends </p> 
      }
    </>
  )
}

export default GroupMembers
