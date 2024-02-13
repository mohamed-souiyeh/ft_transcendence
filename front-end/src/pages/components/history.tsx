import { useEffect, useState } from "react";


function History(obj) {

  const [loserImg, setLoserImg] = useState('')
  const [winnerImg, setWinnerImg] = useState('')

  useEffect(() => {
    setLoserImg(`${process.env.REACT_URL}:1337/users/${obj.data.loser.id}/avatar`);
    setWinnerImg(`${process.env.REACT_URL}:1337/users/${obj.data.winner.id}/avatar`);
    console.log("what the actual fuck");
  }, [])


  return (
    <>
      <div className='bg-purple/15 my-2 mx-4 rounded-lg p-2 flex place-items-center'>
        <div className="flex basis-1/3 items-center">
          <div className="bg-light-green-600 rounded-full w-14 h-14 grid place-items-center">
            <img src={winnerImg} className="rounded-full w-12 h-12 " />
          </div>
          <p className="mx-3"> {obj.data.winner.username} </p>
        </div>
        <div className="flex basis-1/3 justify-center"> -vs- </div>
        <div className="flex basis-1/3 items-center justify-end">
          <p className="mx-3"> {obj.data.loser.username} </p>
          <div className="bg-red-300 rounded-full w-14 h-14 grid place-items-center">
            <img src={loserImg} className="rounded-full w-12 h-12 " />
          </div>
        </div>
      </div>

    </>
  )
}

export default History
