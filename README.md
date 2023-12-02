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
 ### React
 ### Axios

 The front end is made with React and runs on its own port, so when the backend (which is made with nestjs) is running on another port, we will need a way to connect them both to process the clients events, we can process client sockets events by just specifying the server url in the client socket, but on the other hand we also need to fetch data from the server side like user image, user name,.. etc, this is where Axios library comes in handy, it facilitate this process.


# The backend
  ## Authentication and authorization:
  Before the user can access the platform he needs to be authenticated, which means he should pass through a process to prove that the user he is who he claims to be for security reasons, we are using the Google API and 42 API to handle that, so let's talk about the google API first.
      ### Google API:
            Let's briefly talk about what exactly an endpoint is, it is known that the basic relationship between a server and a client is summirized in a request for a certain data and a response to serve the data the client requested, so what an endpoint is its just a place where a server get specefic requests of resource from a client and serves specefic responses from that endpoint, let's say for example there is a hungry person(client) who wants to request a pan 🍳 and an egg 🥚 from a kitchen(server), the server(kitchen) have two endpoints for those different resources, the fridge endpoint where the egg exist and the prep area where the pan exist, which means if he requested the resource from the wrong endpoint he won't get what he wants, endpoints are really usefull to organize resources, i mean imagine having everything put in one place in the kitchen lol.
  ![endpoint drawio](https://github.com/mohamed-souiyeh/transandance/assets/54768823/f6273f80-bce9-45e6-83eb-178fc9f65f73)
So basically that's what an endpoint is.

 - First thing the user is directed to and ***endpoint*** in the server then redirected to the Google login page.
 - After entering the credentials the user is then redirected to another ***endpoint*** to receive those informations.
 - After that comes the check if the user is already in the database or not, if he is not well, he will be added obviously, if he is then we just return the Json Web Token that contains the user informations (the JWT will be explained in a moment)
   


    

# The game:
  The game have a front end and a back end, what the games needs to manage is the players request to the server to specify which paddle to move and where, this is done easily by using the socket.io library, the process of doing a simple multiplier is as the following:
  #
      Client Sends input to the server -> The server gets the input event and broadcast it to all the clients -> The clients get the paddle moving event 
      To specify which paddle will be moved i simply check the order of the clients that are connected, the first one gets to move the first paddle, the second one 
      gets to move the second paddle
Also there is a simple matchmaking system, i have a class for the room where i put the game informations like the client1 socket and client2 socket, the position if each player..etc this is the class:
```ts
    class room
{
    firstClient:Socket = null;
    secondClient:Socket = null;
    firstPaddlePos: number = 0;
    secondPaddlePos: number = 0;
    firstPaddleSpeed: number = 0.01;
    secondPaddleSpeed: number = 0.01;
    firstvelocity: number = 0;
    secondvelocity: number = 0;
    ballPosX: number = 0;
    ballPosY: number = 0;
    ballVelocityX:number = 0;
    ballVelocityY:number = 0;
    score1:number = 0;
    score2:number = 0;
    speed:number = 0.01;
    ballLaunched: boolean = false;
    firstPlayerHaveTheBall: boolean = true;
    secondPlayerHaveTheBall: boolean = false;
    foundMatch:boolean = false;
    roomsName:string = null;
};
```
What i simply do is count how many clients are connected, if they are 2 i create a room and them to it and reset the counter to 0:

```ts
    this.server.on('connection', (socket) =>
    {
                if (this.clientCount == 0)
                    room_.firstClient = socket;
                if (this.clientCount == 1)
                    room_.secondClient = socket;
                this.clientCount++;
                this.clientCount %= 2;
                if (this.clientCount == 0)
                {
                    room_.roomsName = 'room' + this.roomid;
                    this.roomid++;
                    room_.firstClient.join(room_.roomsName);
                    room_.secondClient.join(room_.roomsName);
                    room_.foundMatch = true;
                    this.roomsList.push(room_);
                    room_ = new room();
                }
    }
```
All of this happens in a nestjs WebSocketGateway, basically websocketgateway in nestjs is a class that makes it possible to use any possible socket library in an abstract way even tho socket libraries are already abstracted.




    
    
