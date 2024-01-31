import pic from '../../assets/taha.jpg'

//so.. this function should be taking args, bc we gon use them in showing Player's infos

function Profile({score, score2, pic1, pic2}: 
    {score:number, score2:number, pic1:string, pic2:string})
{
  return(
  <>
        <div>
            <div>
                <img
                    style={
                        {
                            borderRadius:"50%",
                            width:50,
                            float:"right"
                        }
                    } 
                    src={pic1}/>
                <h1 style={
                        {
                            borderRadius:"50%",
                            width:50,
                            float:"right"
                        }
                    } >
                    {score2}
                </h1>
            </div>
            <div>
                <img style={
                        {
                            borderRadius:"50%",
                            width:50,
                            float:"left"
                        }
                    } 
                    src={pic2}/>
                <h1 style={
                        {
                            borderRadius:"50%",
                            width:50,
                            float:"left"
                        }
                    } >
                    {score}
                </h1>
            </div>
        </div>
  </>
  )
}


export default Profile;
