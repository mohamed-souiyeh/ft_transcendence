import souiyeh from "../../assets/souiyeh.jpeg";
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { UserContext } from "../../App";


export default function UserInfo() {



  const [isFriendAdded, setIsFriendAdded] = useState(false);
  const [isFriendPending, setIsFriendPending] = useState(false);
  // const [isUserBlocked, setIsUserBlocked] = useState(false);
  const [imagePath, setImagePath] = useState('');
  const [userData, setUserData] = useState('');
  const navigate = useNavigate();
  const { username } = useParams();
  const { user } = useContext(UserContext);


  useEffect(() => {
    console.log("isFriendAdded: ", isFriendAdded);  
    console.log("isFriendPending: ", isFriendPending);
  }, [isFriendAdded, isFriendPending]);

  useEffect(() => {

    const fetchUserData = () => {
      axios.get(`${process.env.REACT_URL}:1337/users/Public_data/${username}`,
        { withCredentials: true }
      ).then((response) => {
        console.log("response: ", response);
        setUserData(response.data);
        const id = response.data['id'];
        axios.get(`${process.env.REACT_URL}:1337/users/check_notification?receiverId=${id}`, {
          withCredentials: true
        }).then((res) => {
          console.log("res in fetch data : ", res);
          setIsFriendPending(res.data.isPending);
          setIsFriendAdded(res.data.isFriend);
        }).catch((err) => {
          console.log("error while checking notification: ", err);
        })
        setImagePath(`${process.env.REACT_URL}:1337/users/${id}/avatar`);
      }).catch(error => {
        console.error('Error fetching user data:', error);
        navigate("/not-found");
      });
    };

    axios.get(`${process.env.REACT_URL}:1337/users/check_blocked?otherUserUsername=${username}`, {
      withCredentials: true,
    }).then((res) => {
      console.log("res in check blocked: ", res);
      if (res.data.isBlocked) {
        navigate("/not-found");
        return ;
      }
      fetchUserData();
    }).catch((err) => {
      console.log("error while checking blocked: ", err);
      navigate("/not-found");
    });

  }, [username, navigate]);


  const alert = (title: string, text: string, icon: string) => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      customClass: {
        popup: 'w-96 h-auto',
        confirmButton: 'w-32 h-12'
      }
    });
  };

  const alert2 =()=>{
    Swal.fire({
      title: "Are you sure?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "yes",
      denyButtonText: `No`,
      iconColor: 'purple', 
      customClass: {
        popup: 'w-96 h-auto ',
        confirmButton: 'w-32 h-12',
        denyButtonText: 'w-32 h-12',
        
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Unfriend successfully!", "", "success");
      } else if (result.isDenied ) {
        Swal.fire("Good, be more social bro", "", "success");
        setIsFriendAdded(true);
      }
    });
  }



  const handleAddFriend = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_URL}:1337/notifications/friend-request`,
        { 
          senderId: user.data.id,
          receiverId: userData.id,
        },
        { withCredentials: true }
      );

      console.log("response in handle friend: ", response);
      setIsFriendPending(true);
      alert("Friend Added", "You have added the user to your friends list.", "success");
    } catch (error) {
      console.error('Error adding friend:', error);
      alert("Error", "An error occurred while trying to add the user as a friend.", "error");
    }
  };


  const handleUnfriendUser = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_URL}:1337/users/unfriend`,
        { id: userData['id'] },
        { withCredentials: true }
      );
      console.log(response.data);
      setIsFriendAdded(false);
      setIsFriendPending(false);
      alert2();
    } catch (error) {
      console.error('Error unfriending user:', error);
      alert("Error", "An error occurred while trying to unfriend the user.", "error");
    }
  };



  const handleBlockUser = async () => {
    try {
      await axios.post(
        `${process.env.REACT_URL}:1337/users/block`,
        { id: userData['id'] }, {
        withCredentials: true
      });
      alert("User blocked successfully", "", "question");
      //TODO - we can navigate the user to the network page that would be better
      navigate("/home");
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };



  return (
    <div className="flex bg-purple bg-opacity-30  border-[2px] border-purple/20 rounded-3xl ">
      <div className=" bg-purple-sh-2 rounded-full h-48 w-48 grid place-content-center ml-6 mt-6 ">
        <div className="relative inline-block">
          <img className="rounded-full h-44 w-44  " src={imagePath} alt="Profile" />
          {isFriendAdded && (
            <span className="w-8 h-8 rounded-full bg-green absolute bottom-0.5 right-0.5"></span>
          )}
        </div>
      </div>
      <div className="grid place-content-center ">
        <p className="text-white font-bold text-xl ml-10">{userData ? userData.username.toUpperCase() + (userData.username === user.data.username ? "(aka you)" : "") : "Undefined User"}</p>

        {userData && userData.username !== user.data.username && <div className="flex pt-10 ml-10">


          <button
            onClick={isFriendAdded ? handleUnfriendUser : handleAddFriend}
            className="text-white bg-purple ring-2 ring-purple hover:bg-gradient-to-l focus:ring-4 focus:ring-purple-sh-1 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            disabled={isFriendPending}
          >
            {isFriendPending ? "pending request" : isFriendAdded ? 'Unfriend' : 'Add Friend'}
          </button>

          <button
            onClick={handleBlockUser}
            className="text-white bg-purple ring-2 ring-purple hover:bg-gradient-to-l focus:ring-4 focus:ring-purple-sh-1 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ml-8"
          >
            Block User
          </button>
        </div>}
      </div>
    </div>
  );
}



