import axios from "axios";
import { relative } from "path";
import { Dispatch, SetStateAction, useState } from "react";

function Popup({switchValue, setSwitchValue, prompt, setPrompt} : {switchValue: boolean, prompt:boolean, setSwitchValue: Dispatch<SetStateAction<boolean>>, setPrompt: Dispatch<SetStateAction<boolean>>}) {
  const [enable, setEnable] = useState(false);
  const [qrCode, setCode] = useState('');
  const [codeFetched, setStatus] = useState(false);
  const [confirmed, setConfirmed] = useState(true)
  let formdata = new FormData();


  if (!codeFetched)
{
    axios.get("http://localhost:1337/2fa/generate",
      {
        withCredentials: true,
        responseType: 'arraybuffer'
      }
    )
      .then((response) => {
        let image = btoa(
          new Uint8Array(response.data)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        console.log(`data:${response.headers['content-type'].toLowerCase()};base64,${image}`);
        setCode(`data:${response.headers['content-type'].toLowerCase()};base64,${image}`);
      });
    setStatus(true);
  }

  const handleDisable = () => {
    console.log("send request here");
    setSwitchValue(!switchValue);
    setPrompt(!prompt)
  }
  const handleEnable = () => {
    // setEnable(true);
  }
  const handleClose = () => {
    if (switchValue == true)
  {
    }
    setSwitchValue(!switchValue)
    setPrompt(!prompt)
  }

  const verifyCode = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const Code = e.target.verfCode.value; 
    formdata.set("code", Code);
    axios.post("http://localhost:1337/users/update", formdata)
    .then((res) => {
          if (res.status === 200) {
            console.log('the code is correct')
            setEnable(true)
          }
          else {
            console.log('code is rong', res.status)
            setConfirmed(false)
          }
        }
      )
    .catch((e) => {
        console.log('an Error occured!!', e.response.data.message);
        // setConfirmed(false)
      })
    // console.log('Code inserted by user is:', Code);
  }

  return (
    <>
      <div className='h-screen w-screen absolute top-0 left-0 grid place-content-center'>
        <div className='h-[400px] w-[300px] backdrop-blur-sm bg-purple bg-opacity-30 rounded-3xl grid place-content-center z-50'>

          {!enable && switchValue && <>
            <div className="grid place-content-center py-20">
              <p className="text-center text-2xl place-self-center"> Do You Really want to disable 2fa?? </p>
            </div>
            <div className="flex place-content-center gap-3">
              <button className="w-32 rounded-lg bg-purple-sh-1 focus:outline-none border-none hover:bg-purple-sh-2" onClick={() => handleDisable()}>
                Disable
              </button>
              <button className="w-32 rounded-lg bg-purple-sh-1 focus:outline-none border-none hover:bg-purple-sh-2" onClick={() => setPrompt(!prompt)}>
                Cancel
              </button>
            </div>
          </>
          }
          {!enable && !switchValue && <>
            <div className="grid place-content-center py-5 place-self-center">
              <p className="text-cente place-self-center"> Please scan the QR code to enable 2fa </p>
              <img src={qrCode} className="w-40 h-40 my-4 place-self-center"/>
              <form onSubmit={verifyCode} action='' className=" grid place-self-center ">
                <input type='text' name="verfCode" placeholder="Enter verification code" className='w-48 h-12 bg-purple-sh-2 outline-none rounded-lg text-impure-white px-2 place-self-center' />
                <div className="grid h-7">
                  { !confirmed && <p className="ml-12 text-sm text-[#D9534F] font-extrabold"> Wrong code! Try again. </p> }
                </div>
                <div className="flex place-content-center gap-3 pt-1">
                  <button className="w-32 rounded-lg bg-purple-sh-1 focus:outline-none border-none hover:bg-purple-sh-2"  type="submit" value="Send" onClick={() => handleEnable()}> Confirm </button>
                  <button className="w-32 rounded-lg bg-purple-sh-1 focus:outline-none border-none hover:bg-purple-sh-2" onClick={() => setPrompt(!prompt)}> Cancel </button>
                </div>
              </form>
            </div>
          </>}

          {enable && !switchValue &&
            <>
              <div className="grid place-content-center py-20 ">
                <p className="text-center text-xl place-self-center"> two factor authentication was enabled successfully!</p>
              </div>
              <button className="w-32 rounded-lg bg-purple-sh-1 focus:outline-none border-none hover:bg-purple-sh-2 place-self-center" onClick={() => handleClose()}> Close </button>
            </>
          }
        </div>
      </div>
    </>
  )

}

export default Popup


