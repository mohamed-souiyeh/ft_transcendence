import img from '../../assets/taha.jpg'

function Blocked(props) {
  return (
    <div className='flex border border-transparent border-b-purple-sh-0 mx-14 py-3 '>
      <div className='flex place-items-center basis-1/2' >
        <img src={img} className='rounded-full h-12 w-12' />
        <p className='text-lg px-7' > {props.name} </p>
      </div>
      <div className='flex flex-row-reverse  place-items-center basis-1/2' >
         
            <button className="rounded-lg bg-purple-sh-0 focus:outline-none border-none hover:bg-purple text-sm">Unblock</button>
      </div>
    </div>
  )
}

export default Blocked
