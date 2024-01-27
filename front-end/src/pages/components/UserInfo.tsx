import souiyeh from "../../assets/souiyeh.jpeg";
import taha from "../../assets/taha.jpg";
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';


export default function UserInfo() {


  
  const [isFriendAdded, setIsFriendAdded] = useState(false);
  const [isUserBlocked, setIsUserBlocked] = useState(false);
  const [imagePath, setImagePath] = useState('');
  const [userData, setUserData] = useState('');
  const navigate = useNavigate();
  const { username } = useParams();


  useEffect(() => {
    
    if (false) { // I will put here the function whoami that check the logged user

      navigate('/profile');
    }
    else {

      const fetchUserData = async () => {
        try {
          const response = await axios.get(`http://localhost:1337/users/Public_data/${username}`);
          setUserData(response.data);
          const id = response.data['id'];
          setImagePath(`http://localhost:1337/users/${id}/avatar`);
        } catch (error) {
          console.error('Error fetching user data:', error);
          navigate("/not-found");
        }
      };

      fetchUserData();
    }

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

  // const handleAddFriend = async () => {
  //   try {
  //     const friendUsername = username;
  //     await axios.get(`http://localhost:1337/users/Public_data/${friendUsername}`);
  //     setIsFriendAdded(true);
  //   } catch (error) {

  //     console.error('Error adding friend:', error);
  //   }
  // };

  const handleAddFriend = async () => {
    try {
      const response = await axios.post(
        'http://localhost:1337/users/addfriend',
        { id: userData['id'] },
        { withCredentials: true }
      );

      console.log(response.data);
      setIsFriendAdded(true);
      alert("Friend Added", "You have added the user to your friends list.", "success");
    } catch (error) {
      console.error('Error adding friend:', error);
      alert("Error", "An error occurred while trying to add the user as a friend.", "error");
    }
  };


  const handleUnfriendUser = async () => {
    try {
      const response = await axios.post(
        'http://localhost:1337/users/unfriend',
        { id: userData['id'] },
        { withCredentials: true }
      );
      console.log(response.data);
      setIsFriendAdded(false);
      alert("Unfriended successfully", "You have removed the user from your friends list.", "success");
    } catch (error) {
      console.error('Error unfriending user:', error);
      alert("Error", "An error occurred while trying to unfriend the user.", "error");
    }
  };



  const handleBlockUser = async () => {
    try {
      await axios.post(
        'http://localhost:1337/users/block',
        { id: userData['id'] }, {
        withCredentials: true
      });
      alert("User blocked successfully", "", "question");
      setIsUserBlocked(true);
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const handleUnblockUser = async () => {
    try {
      await axios.post(
        'http://localhost:1337/users/unblock',
        { id: userData['id'] }, {
        withCredentials: true
      });
      alert("Unblocked successfully", "", "success");
      setIsUserBlocked(false);
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  const handleSendMessage = () => {
    // Add logic to handle sending a message
    console.log('Send message logic here');
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
        <p className="text-white font-bold text-xl ml-10">{userData ? userData.username.toUpperCase() : "Undefined User"}</p>

        <div className="flex pt-10 ml-10">


          <button
            onClick={isFriendAdded ? handleUnfriendUser : handleAddFriend}
            className="text-white bg-purple ring-2 ring-purple hover:bg-gradient-to-l focus:ring-4 focus:ring-purple-sh-1 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            {isFriendAdded ? 'Unfriend' : 'Add Friend'}
          </button>

          <button
            onClick={isUserBlocked ? handleUnblockUser : handleBlockUser}
            className="text-white bg-purple ring-2 ring-purple hover:bg-gradient-to-l focus:ring-4 focus:ring-purple-sh-1 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            {isUserBlocked ? 'Unblock User' : 'Block User'}
          </button>

          <button
            onClick={handleSendMessage}
            className="text-white bg-purple ring-2 ring-purple hover:bg-gradient-to-l focus:ring-4 focus:ring-purple-sh-1 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}




