
# Client side (the front end):

***The user experience is designed in the following order:***

      When the user first creates an account: 
          Welcome page ->  Sign in page -> User profile creation page -> User home page
  
      When the user is browsing the application: 
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
