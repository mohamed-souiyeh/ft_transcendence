import { useState , useRef} from "react";
import axios from "axios";

function TwoFactorAuthCode () {

    let [code, setcode] = useState("");
    let formdata = new FormData();

    const update = (e)=>
    {
      setcode(e.target.value);
    }

    const onCodeInput = (e)=>
    {
      formdata.set("code", code);
      console.log(code);
      axios.
        post("http://localhost:1337/2fa/verify", formdata,
        {
          withCredentials: true
        }).
        then((res)=>{
          console.log("l7waaaa");
        }).
        catch(
          (e)=>
          {
          }
      );
    };

    return (
      <>

        <div className="w-screen h-screen grid place-content-center">
            <div>
                <h2 style={{
                    color:"white"
                }}>Enter the verification code</h2>
                </div>
                <input onChange={update} maxLength={6} type="text"></input>
                <button onClick={onCodeInput} 
                style=
                {
                  {
                      position:"relative",
                      display: "block",
                      width: "216px",
                      border:"none",
                      borderRadius: "0"
                  }
                }>Submit</button>
        </div>     
      </>
    )
  }
  
  
  export default TwoFactorAuthCode;
  
  