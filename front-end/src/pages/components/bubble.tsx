function Bubble(props : object) {


  return (
    <>
      { props.left ? 
      <div className="flex ">
        <div className="grid max-w-[70%]">
          <div className="flex p-3 pb-0" >
              {/* make username clickable */}
            <p className="text-purple-tone-2 font-bold"> {props.username} </p>
          </div>
          <div className='flex bg-purple rounded-b-xl rounded-tr-xl p-2 m-3 mt-0 break-words shadow-xl'>
            <p className=" "> { props.message }</p>
          </div>
        </div>
      </div> :
      <div className="flex flex-row-reverse ">
        <div className="grid max-w-[70%]">
          <div className="flex flex-row-reverse p-3 pb-0" >
            <p className="text-purple-tone-2 font-bold"> {props.username} </p>
          </div>
          <div className='flex bg-purple-sh-2 rounded-b-xl rounded-tl-xl p-2 m-3 mt-0 break-words shadow-xl'>
            <p className=""> { props.message }</p>
          </div>
        </div>
      </div>
      }
    </>
  )
}

export default Bubble
