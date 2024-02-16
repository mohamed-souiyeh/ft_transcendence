import NavBar from "./components/navbar";
import SideBar from "./components/sidebar";
import Popup from "./components/twofa";
import { Switch, ConfigProvider } from "antd";
import { useState, useContext, useEffect, useRef } from "react";
import newComerPic from "../assets/newcomer.png";
import playerPic from "../assets/player.png";
import veteranPic from "../assets/veteran.png";
import { UserContext } from "../App";
import { useAvatarContext } from "../contexts/avatar";
import axios from "axios";
import Cookies from 'js-cookie';
import History from "./components/history";

function Profile() {


  const { avatar } = useAvatarContext()
  const { user, setUser } = useContext(UserContext)
  const [switchValue, setSwitchValue] = useState(user.data.TFAisEnabled);
  const [prompt, setPrompt] = useState(false);
  const [name, setName] = useState(user.data.username)
  const [badName, setBadName] = useState(false);
  const [badFile, setBadFile] = useState(false);
  const [success, setSuccess] = useState(false);
  const [history, setHistoty] = useState([])
  const [achievs, setAchievs] = useState([])
  const [newComer, setNewComer] = useState(false)
  const [player, setPlayer] = useState(false)
  const [veteran, setVeteran] = useState(false)
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {setAvatar} = useAvatarContext()

  let formdata = new FormData();

  const changeUserName = (e: React.FormEvent) => {
    e.preventDefault()

    const regex: RegExp = /^[a-zA-Z0-9][a-zA-Z0-9_]{1,12}$/;

    if (!regex.test(name))
      return setBadName(true)

    if (name.length)
      formdata.set("username", name);

    axios.post(`${process.env.REACT_URL}:1337/users/update/username`, formdata, {
      withCredentials: true
    })
      .then((res) => {
        if (res.status == 200) {
          setBadName(false)
          setSuccess(true)
          axios.get(`${process.env.REACT_URL}:1337/users/allforhome`, {
            withCredentials: true
          })
            .then((resp) => {
              setUser(prevUser => ({ ...prevUser, data: resp.data }))
              Cookies.remove('user')
              Cookies.set('user', JSON.stringify(resp.data), { sameSite: 'lax'   });
            })
            .catch(() => {})
        }
      })
      .catch(() => {
        setSuccess(false)
        setBadName(true)
      })
  }

  useEffect(() => {
    axios.get(`${process.env.REACT_URL}:1337/users/Public_data/${user.data.username}`,
      { withCredentials: true })
      .then(res => {
        setHistoty(res.data.allMatches)
        setAchievs(res.data.achievements)
      })
      .catch(() => {})
  }, [])

  useEffect( () => {
    axios.get(`${process.env.REACT_URL}:1337/users/allforhome`, {
      withCredentials: true
    })
      .then((resp) => {
        setUser(prevUser => ({ ...prevUser, data: resp.data }))
        Cookies.remove('user')
        Cookies.set('user', JSON.stringify(resp.data), { sameSite: 'lax'   });
      })
      .catch(()=> {})
  },[])

  useEffect (() => { 
    achievs.forEach((achievement) => {
      if (achievement.name === "newComer") {
        setNewComer(true);
      } else if (achievement.name === "Player") {
        setPlayer(true);
      } else if (achievement.name === "Veteran") {
        setVeteran(true);
      }
    });
  },[achievs])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBadFile(false)
    if (e.target.files && e.target.files[0]) {
      if( (e.target.files[0].type != "image/jpg" && e.target.files[0].type != "image/jpeg" && e.target.files[0].type != "image/png" ) ||  e.target.files[0].size >=  1024 * 1024 * 5){
        setBadFile(true)
      }
      else {
        setImage(e.target.files[0])
      } }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const updateAvatar = (e: React.FormEvent) => {
    e.preventDefault()

    if (image){ 
      formdata.set("avatar", image);

      axios.post(`${process.env.REACT_URL}:1337/users/update/avatar`, formdata, {
        withCredentials: true
      })
        .then( (res)=> {
          if (res.status == 200) {
            axios.get(`${process.env.REACT_URL}:1337/users/allforhome`, {
              withCredentials: true
            })
              .then((resp) => {
                setUser(prevUser => ({ ...prevUser, data: resp.data }))
                Cookies.remove('user')
                Cookies.set('user', JSON.stringify(resp.data), { sameSite: 'lax'   });

                const reader = new FileReader();
                reader.onload = () => {
                  const base64Image = reader.result as string;
                  setAvatar(base64Image);
                  localStorage.removeItem('avatar');
                  localStorage.setItem('avatar', base64Image);
                };
                reader.readAsDataURL(image);

              })
              .catch(()=> {})
          }
        })
        .catch(()=>{
          setBadFile(true)
        });
    }

  }
  // useEffect(() =>{},[badFile])

  return(
    <>
      <div className="grid justify-center w-screen h-screen bg-gradient-to-br from-purple-sh-2 from-10% via-purple-sh-1 via-30% to-purple ">
        <SideBar />
        <NavBar />

        {prompt && <Popup switchValue={switchValue} setSwitchValue={setSwitchValue} prompt={prompt}
          setPrompt={setPrompt}
        />}
        <div className="bg-purple bg-opacity-10 backdrop-blur-lg border-[1px] border-purple/20 h-64 mt-20 mb-16 rounded-3xl flex">
          <div className="grid place-content-center">
            <form className="grid place-items-center  h-64" onSubmit={updateAvatar}>
              <div onClick={handleImageClick}  className=" hover:cursor-pointer bg-purple-sh-2 mx-12 rounded-full h-48 w-48 grid place-content-center ">
                {image && <img src={URL.createObjectURL(image)} alt="Uploaded" className="rounded-full h-44 w-44"  />}
                {!image && <img className="rounded-full h-44 w-44 " src={avatar} />}
                <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} style={{ display: 'none' }} />
              </div>
              {badFile &&  <p className="font-bold text-red-500 text-sm "> bad File! </p>}
              <button className="rounded-lg bg-purple-sh-2 hover:border hover:border-purple-sh-2 hover:bg-purple-sh-1 h-6 my-0 py-0  text-sm " type="submit"> save </button>
            </form>
          </div >
          <div className=" m-6 grid place-content-center">
            <p className="text-2xl m-2"> Nickname </p>
            <p className="text-2xl m-2"> Score </p>
            <p className="text-2xl m-2"> Matches</p>
            <p className="text-2xl m-2"> 2fa state </p>
          </div>
          <div className=" m-6 grid place-content-center">
            <form className="flex w-[100%]" onSubmit={changeUserName}>
              <p className="text-2xl m-2">:</p>
              <input maxLength={13} title="Click To edit" className="w-[40%] bg-transparent border-none focus:outline-none focus:border-none text-2xl" type="text" value={name} onChange={(e) => setName(e.target.value)} />
              {badName && <p className="font-bold text-red-500 text-lg m-3"> bad Name! </p>}
              {success && <p className="font-bold text-light-green-500 text-lg m-3"> Updated! </p>}
              <button className="rounded-lg bg-purple-sh-2 hover:border hover:border-purple-sh-2 hover:bg-purple-sh-1 h-11" type="submit"> change </button>
            </form>
            <p className="text-2xl m-2">:  {user.data.score}</p>
            <p className="text-2xl m-2">:  {user.data.matchesPlayed}</p>
            <div className="flex ">
              <p className="text-2xl m-2">:  </p>
              <div className="pt-3">
                <ConfigProvider theme={{ token: { colorPrimary: '#8176AF', }, }} >
                  <Switch className="bg-purple-sh-1" checkedChildren="On" unCheckedChildren='Off'
                    defaultChecked={false} //default here should be based on what's on the database.
                    checked={switchValue}
                    onChange={() => setPrompt(true)}
                  />
                </ConfigProvider>
              </div>
            </div>
          </div>
        </div>


        <div className="h-[95px] flex"> </div>

        <div className="flex overflow-hidden mt-16">
          <div className="grid justify-center mx-5">
            <div className="h-[100%]  w-[500px] rounded-t-3xl overflow-hidden">
              <div className="bg-purple-sh-2 h-[100%]  w-[500px] rounded-t-3xl overflow-auto scrollbar-thin scrollbar-thumb-purple-sh-1 ">
                <div className="sticky top-0 flex place-content-between bg-purple-sh-2 bg-opacity-70 backdrop-blur-sm rounded-t-3xl px-2 py-4 z-0" >
                  <p className="text-xl text-purple-tone-2 text-opacity-100">Matchs History:</p>
                </div>
                {history.length ? history.map((matches) => <History key={matches.id} data={matches} />) : <p className="text-xl text-purple/50 p-5"> No history made yet </p>}
              </div>
            </div>
          </div>

          <div className="grid justify-center">
            <div className="h-[100%]  w-[350px] rounded-t-3xl overflow-hidden">
              <div className="bg-purple-sh-2 h-[100%]  w-[350px] rounded-t-3xl ">
                <div className="sticky top-0 flex place-content-between bg-purple-sh-2 bg-opacity-70 backdrop-blur-sm rounded-t-3xl px-2 py-4 z-0" >
                  <p className="text-xl text-purple-tone-2 text-opacity-100">acheivements:</p>
                </div>
                <div title="Played your first game ever" className="m-4 h-24 flex justify-start items-center border-b-2 border-purple/15">
                  <img src={newComerPic} className={`h-20 mx-4 ${!newComer && 'grayscale-70 opacity-30'} `}/>
                  <p className={`text-2xl ${newComer ? 'text-impure-white' : 'text-white/30'} `} > New Comer</p>
                </div>
                <div title="Played 5 matches" className="m-4 h-24 flex justify-start items-center border-b-2 border-purple/15">
                  <img src={playerPic} className={`h-20 mx-4 ${!player && 'grayscale-70 opacity-30'} `}/>
                  <p className={`text-2xl ${player ? 'text-impure-white' : 'text-white/30'} `} > Pro Player!</p>
                </div>
                <div title="Played more than 5 and won 5 matches" className="m-4 h-24 flex justify-start items-center border-b-2 border-purple/15">
                  <img src={veteranPic} className={`h-20 mx-4 ${!veteran && 'grayscale-70 opacity-30'} `}/>
                  <p className={`text-2xl ${veteran ? 'text-impure-white' : 'text-white/30'} `} > Veteran!</p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Profile
