import { useState, useContext } from "react";
import Navbar from "./components/navbar";
import SearchResaults from "./components/searchResaults";
import SideBar from "./components/sidebar";
import axios from "axios";


const mocSearchResult = {
  id: 1,
  username: 'med',
  score: 0,
  status: 'online'
};

type searchResault = typeof mocSearchResult;

function Search() {
  const [val, setVal] = useState("")
  const [searchResaults, setSearchResaults] = useState<searchResault[]>([]);

  const getFriends = (e: React.FormEvent) => {
    e.preventDefault()
    if (!val) return setSearchResaults([]);

    axios.get(`${process.env.REACT_URL}:1337/users/search/?prefix=${val}`,
      {
        withCredentials: true,
      }
    ).then((res) => {
        setSearchResaults(res.data);
      })
      .catch(() => {})

  }

  return (
    <>
      <SideBar />
      <Navbar />
      <div className="w-screen h-screen bg-purple-sh-1 grid place-items-center">
        <div className="w-[50%] h-[90%] bg-purple-sh-2 rounded-xl p-3 border border-purple-sh-1  overflow-y-scroll scrollbar-thin scrollbar-thumb-purple-sh-1 ">

          <div className="flex flex-row-reverse py-2" >
            <form onSubmit={getFriends} className="flex bg-purple-sh-1 rounded-xl items-center h-9">
              <svg className="w-8 h-8 stroke-purple stroke-2 m-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input maxLength={15} onChange={(e) => setVal(e.target.value)} type='text' placeholder="search for a friend" className='h-12 p-3 bg-transparent cursor-text border-transparent outline-none placeholder:italic placeholder:text-purple/60' />
            </form>
          </div>
          <div className={`grid w-[100%] ${!searchResaults.length && 'place-content-center'}`}>
            {searchResaults.length ? searchResaults.map((grp) => <SearchResaults name={grp.username} state={grp.status} id={grp.id} key={grp.id} />) :
              <p className="text-xl text-purple/50 p-5"> Enter a Valid name to search for a friend </p>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default Search
