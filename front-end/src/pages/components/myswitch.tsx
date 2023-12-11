import { Switch, ConfigProvider, Button } from "antd";
import { useState } from "react";

function MySwitch(onClick : () => any) {

  const [switchValue, setSwitchValue] = useState(false)
  const [prompt, promptIsVisible] = useState(false)


  const handleSwitchChange = () => {

   //setSwitchValue(!switchValue)
    //instead of changing we need a confiramtion prompt, we call it down:
    promptIsVisible(true);
  }

  const handlePrompt = (confirm : boolean) => {
    if (confirm){

     setSwitchValue(!switchValue)
    }
    promptIsVisible(false)
  }


  return (
      <>
      <ConfigProvider theme={{ token: { colorPrimary: '#8176AF',  }, }} >
        <Switch className="bg-purple-sh-1" checkedChildren="On" unCheckedChildren='Off' 
          defaultChecked={false} //default here should be based on what's on the database.
          checked={switchValue}
          onChange={handleSwitchChange}
        />
      </ConfigProvider>
      {/* Prompt for when the 2fa is already enabled and the user want to disable it */}
      {prompt && switchValue && (
        <div className='h-[400px] w-[300px] bg-purple-sh-1'>
            <p>Are you sure you want to disable the 2FA?</p>
            <Button className="" onClick={ () => handlePrompt(true)}>
              yes
            </Button >

            <Button className="" onClick={ () => handlePrompt(false)}>
              no
            </Button >
        </div>
      )}

      {/* Prompt for enabling the 2fa*/}
      {prompt && !switchValue && (
        <div className='h-[400px] w-[300px] bg-purple-sh-1'>
            <p>Do YOU Wanna Build A SNOW MAAAAAAN?</p>
            <Button className="" onClick={ () => handlePrompt(true)}>
              yes
            </Button >

            <Button className="" onClick={ () => handlePrompt(false)}>
              no
            </Button >
        </div>
      )}
  </>
  )
}

export default MySwitch
