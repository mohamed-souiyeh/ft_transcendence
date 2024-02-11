import { useEffect, useState } from 'react';

function Ranked(player: Object) {
  const [img, setImagePath] = useState('')
  useEffect(() => {
    // console.log("player: ", player);
    setImagePath(`${process.env.REACT_URL}:1337/users/${player.id}/avatar`);
  }, [])
  return (
    <>
      <div className='mb-5 mx-14 h-14 bg-[#343045] flex place-content-between rounded-2xl '>

        <div className=' flex '>
          <div className='grid place-content-center ml-2 w-12'>
            <img className='rounded-full h-10 w-10' src={img} />
          </div>
          <div className='grid place-content-center ml-2'>
            <p> {player.name} </p>
          </div>
        </div>

        <div className='w-[160px] grid place-content-center'>
          <p> {player.matchesPlayed} </p>
        </div>

        <div className='w-[160px] grid place-content-center'>
          <p> {player.score} </p>
        </div>
      </div>
    </>
  )
}

export default Ranked;
