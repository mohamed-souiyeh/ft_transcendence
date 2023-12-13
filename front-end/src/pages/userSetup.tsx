import { useState , useRef} from "react";
import  pic from "../assets/taha.jpg"
import { apiGlobal } from "./interceptor";
import { useNavigate } from "react-router-dom";

function Welcome()
{
   return <> 
   		<div>
				<span style={
								{
									color: "#A097CB",
									fontSize: 26,
									fontFamily: "sans-serif", 
									fontWeight: 700,
									wordWrap: "break-word"
								}
							}>Welcome! 
				</span>
				<span style=
							{
								{
									color: "white", 
									fontSize: 26, 
									fontFamily: "sans-serif",
									fontWeight: 700,
									wordWrap: "break-word"
								}
							}
								>
									Let’s create your profile
				</span>
			</div>
				<div style=
				{
					{
						width: 292, 
						height: 21, 
						color: "#DFDAF6", 
						fontSize: 16,
						fontFamily: "sans-serif", 
						fontWeight: 700, 
						wordWrap: "break-word"
					}
				}
				>
				please choose a special nickname
			</div>
	</>
}

function Setup()
{

    //NOTE - from here start the code comunicationg with the back_end
	let inputRef = useRef(null);
	let [srcImg, setProfilePic] = useState("");
    let [userName, setName] = useState("");
	let formdata = new FormData();
	let [userNameMessage, setUsername] = useState("");
	const navigate = useNavigate();

	const click = () =>
	{
		if (inputRef.current)
		    inputRef.current.click();
	};

    const onUserInput = (e)=>
    {
		setName(e.target.value);
    };
	
	const change = (event) =>
	{
		setProfilePic(event.target.files[0]);
	};

	apiGlobal.interceptors.response.use(
		response => response,
		async error => {
			const status = error.response ?.status;
			if (status === 401) {
				console.log("hoooo");
				await apiGlobal.get("/auth/refresh",
				{
					withCredentials: true
				})
				return apiGlobal(error.config);
			}
			return Promise.reject(error);
		}
	);

	const changeBoth = () =>
	{
		formdata.set("username", userName);
		formdata.set("avatar", srcImg);

		apiGlobal.
			post("/users/update", formdata,
			{
				withCredentials: true
			}).
			then(
			(res)=>
			{
				setUsername("");
				if (res.status == 200)
				{
					navigate("/home");
				}
			})
			.
			catch((e)=>{
				
				setUsername(e.response.data.message);
			}
		);
	}


	return <>
	<div className="w-screen h-screen grid place-content-center">
						<div style=
						{
							{
								alignSelf: "stretch", 
								flexDirection: "column",
								justifyContent: "flex-start", 
								alignItems: "flex-start", 
								gap: 10,
								display: "inline-flex"
							}
						}
						>
						<div style={{
							flexDirection: 'column',
							justifyContent: 'flex-start',
							alignItems: 'flex-start',
							gap: '30px',
							display: 'flex',
						}}
					>
					<div style=
							{
								{
									flexDirection: "column",
									justifyContent: "flex-start", 
									alignItems: "flex-start",
									gap: 6, 
									display: "flex"
								}
							}
							>
						<Welcome/>
				</div>
				<div  style={{
					paddingTop: '4px',
					paddingBottom: '5px',
					paddingLeft: '6px',
					paddingRight: '137px',
					borderRadius: '3px',
					overflow: 'hidden',
					borderBottom: '1px rgba(192, 183, 232, 0.50) solid',
					justifyContent: 'flex-start',
					alignItems: 'center',
					display: 'inline-flex',
				}}>
				<div 
                        suppressContentEditableWarning={true}
                        contentEditable="true"
					    style={{
						color: 'rgba(255, 255, 255, 255)',
						fontSize: '16px',
						fontFamily: 'sans-serif',
						fontWeight: '700',
						wordWrap: 'break-word',
					}}
					>
						<label>
							{/* username: */}
							<input onChange={onUserInput} type="text"
									style={{
										background:"transparent"
									}}/>
						</label>
					</div>
					<div style={{color:"red"}}>
						{userNameMessage}
					</div>
				</div>
			</div>
			<div
				style={{
					height: '205px',
					flexDirection: 'column',
					justifyContent: 'flex-start',
					alignItems: 'center',
					gap: '14px',
					display: 'flex',
				}}
				>
				<div
					style={{
						height: '166px',
						flexDirection: 'column',
						justifyContent: 'flex-start',
						alignItems: 'flex-start',
						gap: '20px',
						display: 'flex',
					}}
					>
					<div
						style={{
							width: '292px',
							height: '21px',
							color: '#DFDAF6',
							fontSize: '16px',
							fontFamily: 'sans-serif',
							fontWeight: '700',
							wordWrap: 'break-word',
						}}
						>
								add an avatar</div>
						<div
						style={{
							width: '460px',
							justifyContent: 'flex-start',
							alignItems: 'center',
							gap: '26px',
							display: 'inline-flex',
						}}
						>
						<div onClick={click}>
							<form name="avatar" encType="multipart/form-data">
							{srcImg ?
									<img
										src={URL.createObjectURL(srcImg)}
										style=
										{
											{
												width: '125px',
												height: '125px',
												borderRadius: '100px',
												overflow: 'hidden',
												border: '3px rgba(192, 183, 232, 0.42) solid',
												justifyContent: 'center',
												alignItems: 'center',
											}
										}
										alt=""
									/> :
									<img
										src={pic}
										style=
										{
											{
												width: '125px',
												height: '125px',
												borderRadius: '100px',
												overflow: 'hidden',
												border: '3px rgba(192, 183, 232, 0.42) solid',
												justifyContent: 'center',
												alignItems: 'center',
											}
										}
										alt="Had tswira mkaynach"/>
									}
								<input 
									type="file"
									ref={inputRef}
									onChange={change}
									style=
									{{
										display: 'none'
									}}
								/>
							</form>
						</div>
						<div
						style={{
							width: '309px',
							height: '40px',
							color: 'rgba(202, 183, 232, 0.42)',
							fontSize: '13px',
							fontFamily: 'sans-serif',
							fontWeight: '400',
							wordWrap: 'break-word',
						}}
						>
						a default avatar will be set for you if this step was skipped.</div>
					</div>
				</div>
				<div>
					<button
					style={{
						width: '121px',
						height: '25px',
						paddingLeft: '29px',
						paddingRight: '29px',
						paddingTop: '5px',
						paddingBottom: '5px',
						background: '#C0B7E8',
						borderRadius: '8px',
						overflow: 'hidden',
						justifyContent: 'center',
						alignItems: 'center',
						gap: '10px',
						display: 'inline-flex',
					}}
					onClick={changeBoth}>
							Continue
						</button>
				</div>
			</div>
		</div>
	</div>
	</>
}

export default Setup;
