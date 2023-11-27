# Client side (the front end):


## ***The user experience is designed in the following order:***

***When the user first creates an account:***

    Welcome page ->  Sign in page -> User profile creation page -> User home page
  
***When the user is browsing the application:***

          User home page -> Select a game to play, with other players or bot
              |
              ---> See other players rank
          Browsing other user profile -> See his connection status if not blocked
              | | | |
              | | | ---> Send a friend request
              | | ---> Block
              | ---> Send a message
              ---> See his game history
          Looking at his own profile -> See matches history with other players
              |
              ---> Modify profile (picture, name, nickname)
          Game page -> See both users profiles on each side of the canvas
              |
              ---> See the score
        
   Note: The search bar, home page button, profile page button, log out button, notifications, are available on all pages

## The used technologies for the front and how the front can be connected with the backend
 React
    ![react](https://github.com/mohamed-souiyeh/transandance/assets/54768823/4ef7817e-74af-49a4-ac6c-d0d82305fa8a)
 Axios
    ![Axios_(computer_library)_logo svg](https://github.com/mohamed-souiyeh/transandance/assets/54768823/41e3907f-ba05-465a-9433-535ffc8f21b8)



 The front end is made with React and runs on its own port, so when the backend (which is made with nestjs) is running on another port, we will need a way to connect them both to process the clients http requests and send them to the server to get a response, this is where Axios library comes in handy, it facilitate this process by simply specifying to the client socket which port it wants to listen to and the connection is then established.
    
