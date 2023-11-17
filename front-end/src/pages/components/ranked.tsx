import pic from '../../assets/taha.jpg'

//so.. this function should be taking args, bc we gon use them in showing Player's infos

function Ranked() {
  return(
  <>
      <div className='mb-5 mx-14 h-14 bg-[#343045] flex place-content-between rounded-2xl '>
        
        <div className=' flex '>
          <div className='grid place-content-center ml-2 w-12'>
            <img className='rounded-full h-10 w-10' src={pic}/>
          </div>
          <div className='grid place-content-center ml-2'>
            <p> Player's name </p>
          </div>
        </div>

        <div className='w-[160px] grid place-content-center'>
          <p> 51 </p>
        </div>
        
        <div className='w-[160px] grid place-content-center'>
          <p> 1 </p>
        </div>
      </div>
  </>
  )
}


export default Ranked;
