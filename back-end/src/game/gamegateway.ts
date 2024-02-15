import {
  OnModuleInit
}
  from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
}
  from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/database/users/users.service';
import { gameService } from './game.service';
import { room } from './Room';
import { MatchDto } from 'src/database/matches/matches.dto';
import { eventBus } from 'src/eventBus';
import { JwtAuthService } from 'src/auth/jwt/jwt.service';
import { baseGateWayConfig } from 'src/sockets/baseGateWayConfig/baseGateWay.config';

const gameGatewayConfig = {
  ...baseGateWayConfig,
  namespace: "game"
}

// Managing the sockets
@WebSocketGateway(gameGatewayConfig)
export class gameServer implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  roomID: number = 0;

  roomsList: Map<number, room> = new Map<number, room>();

  constructor(
    private gameService: gameService,
    private userService: UsersService,
    private jwtAuthService: JwtAuthService
  ) { }

  onModuleInit() {
    this.gameService.gameLoop(this.server, this.roomsList);
  }

  async handleConnection(client: Socket) {

    console.log("Client connected to gamegateway", client.id);
    const user = await this.gameService.chatService.getUserFromSocket(client);
    if (user == null)
      return;
    const userStatus: string = await this.userService.getStatus(user.id);
    console.log("Status ", userStatus);
    if (userStatus == "busy") {
      console.log("Already queuing");
      return;
    }
  }

  getUser = async (client: Socket) => {
    const { jwt } = await this.gameService.chatService.getTokensFromSocket(client);

    const payload = await this.jwtAuthService.decodetoken(jwt);

    const user = await this.userService.findUserById(payload.id);

    return user;
  }

  async handleDisconnect(client: Socket) {
    const roomCheck = Array.from(this.roomsList.values())
      .find(room => room.firstClient === client
        || room.secondClient === client);
    let user1, user2;
    if (roomCheck && roomCheck.firstClient)
      user1 = await this.getUser(roomCheck.firstClient);
    if (roomCheck && roomCheck.secondClient)
      user2 = await this.getUser(roomCheck.secondClient);
    console.log("Leave room from disconnect");
    if (user1) {
      console.log("User1 ", user1.id);
      await this.userService.setOnlineStatus(user1.id);
    }
    if (user2) {
      console.log("User2 ", user2.id);
      await this.userService.setOnlineStatus(user2.id);
    }
    if (roomCheck) {
      this.server.to(`${roomCheck.id}`).emit("leaveGame");
      this.roomsList.delete(roomCheck.id);
    }
  }

  @SubscribeMessage('botMode')
  async setGameAsBotMode(client: Socket) {
    let user = await this.getUser(client);
    if (!user)
      return;

    let userStatus: string = await this.userService.getStatus(user.id);
    if (userStatus == "busy") {
      console.log("Already queuing");
      return;
    }
    await this.userService.setBusyStatus(user.id);
    let room_ = await new room();
    room_.firstClient = client;
    room_.gameMode = "robot";
    room_.roomState = "ready";
    room_.id = this.roomID;
    this.roomID++;
    this.roomsList.set(room_.id, room_);
    client.join(`${room_.id}`);
  }

  @SubscribeMessage('invite')
  async invitePlayer(client: Socket, invitedUserID: number) {
    const user = await this.getUser(client);
    const otherUser = await this.userService.findUserById(invitedUserID);

    const isBlocked = await this.userService.getBlockStatus(user.id, otherUser.username);

    if (isBlocked.isBlocked) {
      return;
    }

    if (!user)
      return;
    if (await this.userService.getStatus(invitedUserID) == "busy" ||
      await this.userService.getStatus(user.id) == "busy") {
      return;
    }
    await this.userService.setBusyStatus(user.id);
    console.log("Invite player");
    let room_ = new room();
    room_.id = this.roomID;
    this.roomID++;
    room_.firstClient = client;
    room_.gameMode = "private";
    room_.roomState = "invite";
    console.log("Invite player to room ", room_.id);
    client.join(`${room_.id}`);
    this.roomsList.set(room_.id, room_);
    eventBus.emit("privateGame", user.id, invitedUserID, room_.id);

    setTimeout(async () => {
      if (room_ && room_.roomState === "invite") {
        let user = await this.getUser(room_.firstClient);
        if (!user)
          return;
        await this.userService.setOnlineStatus(user.id);
        if (room_) {
          this.roomsList.delete(room_.id);
          console.log("Invite declined");
        }
      }
    }, 6000);
  }

  @SubscribeMessage('acceptPlayingInvite')
  async acceptMatchInvite(client: Socket, roomID: number) {
    console.log("Player accept invite ", roomID);
    let roomCheck = Array.from(this.roomsList.values())
      .find(room => room.id === roomID);
    if (roomCheck) {
      client.join(`${roomCheck.id}`);
      roomCheck.secondClient = client;
      roomCheck.roomState = "ready";
      this.server.to(`${roomCheck.id}`).emit("inviteAccepted");
      this.server.to(`${roomCheck.id}`).emit("matchFound", true);
      roomCheck.secondName = await this.getUser(client).then((user) => {
        if (user)
          return user.username;
      });
      roomCheck.user2ID = await this.getUser(roomCheck.secondClient).then((user) => {
        if (user)
          return user.id;
      });
      roomCheck.user1ID = await this.getUser(roomCheck.firstClient).then((user) => {
        if (user)
          return user.id;
      });
      if (roomCheck.user1ID && roomCheck.user2ID) {
        console.log("User IDs ", roomCheck.user1ID, roomCheck.user2ID);
        this.server.to(`${roomCheck.id}`).emit("userIDs",
          roomCheck.user1ID,
          roomCheck.user2ID);
      }
    }
  }
  @SubscribeMessage('declinePlayingInvite')
  async declineMatchInvite(client: Socket, roomID: number) {
    console.log("Player decline invite ", roomID);
    let roomCheck = Array.from(this.roomsList.values())
      .find(room => room.id === roomID);
    let user = await this.getUser(roomCheck.firstClient);
    if (!user)
      return;
    await this.userService.setOnlineStatus(user.id);
    if (roomCheck) {
      this.roomsList.delete(roomCheck.id);
    }
  }
  @SubscribeMessage('leaveRoom')
  async leaveMatch(client: Socket) {
    let match = new MatchDto();
    let roomCheck = Array.from(this.roomsList.values())
      .find(room => room.firstClient === client
        || room.secondClient === client);
    console.log("Leave room");
    if (roomCheck && roomCheck.roomState != "gameOver") {
      if (this.roomsList.has(roomCheck.id)) {

        this.roomsList.get(roomCheck.id).roomState = "gameOver";
        console.log("Set game over now !!");
      }
      let user1, user2;
      if (roomCheck.firstClient)
        user1 = await this.getUser(roomCheck.firstClient);
      if (roomCheck.secondClient)
        user2 = await this.getUser(roomCheck.secondClient);
      this.server.to(`${roomCheck.id}`).emit("leaveGame");
      if (roomCheck.gameMode != "robot") {
        if (roomCheck.firstClient == client) {
          match.winnerId = roomCheck.user2ID;
          match.loserId = roomCheck.user1ID;
          match.endedAt = roomCheck.endTime;
          match.mode = roomCheck.gameMode;
          match.winnerStats = {
            score: roomCheck.score2,
            name: roomCheck.secondName
          };
          match.loserStats = {
            score: roomCheck.score1,
            name: roomCheck.firstName
          };
        }
        else if (roomCheck.secondClient == client) {
          match.winnerId = roomCheck.user1ID;
          match.loserId = roomCheck.user2ID;
          match.mode = roomCheck.gameMode;
          match.endedAt = roomCheck.endTime;
          match.winnerStats = {
            score: roomCheck.score1,
            name: roomCheck.firstName
          };
          match.loserStats = {
            score: roomCheck.score2,
            name: roomCheck.secondName
          };
        }
        if (match.winnerId && match.loserId)
          this.gameService.matchesService.create(match);
      }
      if (user1) {
        const playedMatches = (await this.userService.getUserDataForHome(user1.id)).matchesPlayed + 1;
        const wonMatches = (await this.userService.getUserDataForHome(user1.id)).wins;
        if (playedMatches == 1)
          await this.userService.createAchievement(user1.id, "newComer");
        if (playedMatches == 5)
          await this.userService.createAchievement(user1.id, "Player");
        if (playedMatches > 5 && wonMatches == 5)
          await this.userService.createAchievement(user1.id, "Veteran");
        console.log("Played matches user1: " + playedMatches);
        await this.userService.setOnlineStatus(user1.id);
      }
      if (user2) {
        const playedMatches = (await this.userService.getUserDataForHome(user2.id)).matchesPlayed + 1;
        const wonMatches = (await this.userService.getUserDataForHome(user2.id)).wins;
        if (playedMatches == 1)
          await this.userService.createAchievement(user2.id, "newComer");
        if (playedMatches >= 5)
          await this.userService.createAchievement(user2.id, "Player");
        if (playedMatches > 5 && wonMatches >= 5)
          await this.userService.createAchievement(user2.id, "Veteran");
        console.log("Played matches user2: " + playedMatches);
        await this.userService.setOnlineStatus(user2.id);
      }
      this.roomsList.delete(roomCheck.id);
    }
  }
  @SubscribeMessage('gameOver')
  async gameOver(client: Socket) {
    let match = new MatchDto();
    console.log("Game over");
    let roomCheck = Array.from(this.roomsList.values()).find(room => room.secondClient === client ||
      room.firstClient === client);
    if (roomCheck && roomCheck.roomState != "gameOver") {
      if (this.roomsList.has(roomCheck.id)) {

        this.roomsList.get(roomCheck.id).roomState = "gameOver";
        console.log("Set game over now !!");
      }
      if (roomCheck.gameMode != "robot") {
        let user1, user2;
        if (roomCheck.firstClient)
          user1 = await this.getUser(roomCheck.firstClient);
        if (roomCheck.secondClient)
          user2 = await this.getUser(roomCheck.secondClient);
        if (roomCheck.score1 > roomCheck.score2) {
          console.log("Right");
          match.winnerId = roomCheck.user2ID;
          match.loserId = roomCheck.user1ID;
          match.endedAt = roomCheck.endTime;
          match.mode = roomCheck.gameMode;
          match.winnerStats = {
            score: roomCheck.score1,
            name: roomCheck.firstName
          };
          match.loserStats = {
            score: roomCheck.score2,
            name: roomCheck.secondName
          };
          this.userService.findUserById(roomCheck.user2ID).then((user) => {
            this.userService.setScore(user.id, user.score + (roomCheck.score1 - roomCheck.score2));
            console.log("Score ", (roomCheck.score1 - roomCheck.score2));
          });
          this.server.to(`${roomCheck.firstClient.id}`).emit("winner", false);
          let user = await this.getUser(roomCheck.firstClient);
          if (!user)
            return;
        }
        else if (roomCheck.score1 < roomCheck.score2) {
          console.log("Left");
          match.winnerId = roomCheck.user1ID;
          match.loserId = roomCheck.user2ID;
          match.mode = roomCheck.gameMode;
          match.endedAt = roomCheck.endTime;
          match.winnerStats = { score: roomCheck.score2, name: roomCheck.secondName };
          match.loserStats = { score: roomCheck.score1, name: roomCheck.firstName };
          this.userService.findUserById(roomCheck.user1ID).then(async (user) => {
            await this.userService.setScore(user.id, user.score + (roomCheck.score2 - roomCheck.score1));
            console.log("Score ", (roomCheck.score2 - roomCheck.score1));
          });
          this.server.to(`${roomCheck.secondClient.id}`).emit("winner", false);
          let user = await this.getUser(roomCheck.secondClient);
          if (!user)
            return;
          await this.userService.setOnlineStatus(user.id);
        }
        if (user1) {
          const playedMatches = (await this.userService.getUserDataForHome(user1.id)).matchesPlayed + 1;
          const wonMatches = (await this.userService.getUserDataForHome(user1.id)).wins;
          if (playedMatches == 1)
            await this.userService.createAchievement(user1.id, "newComer");
          if (playedMatches == 5)
            await this.userService.createAchievement(user1.id, "Player");
          if (playedMatches > 5 && wonMatches == 5)
            await this.userService.createAchievement(user1.id, "Veteran");
          console.log("Played matches user1: " + playedMatches);
          await this.userService.setOnlineStatus(user1.id);
        }
        if (user2) {
          const playedMatches = (await this.userService.getUserDataForHome(user2.id)).matchesPlayed + 1;
          const wonMatches = (await this.userService.getUserDataForHome(user2.id)).wins;
          if (playedMatches == 1)
            await this.userService.createAchievement(user2.id, "newComer");
          if (playedMatches >= 5)
            await this.userService.createAchievement(user2.id, "Player");
          if (playedMatches > 5 && wonMatches >= 5)
            await this.userService.createAchievement(user2.id, "Veteran");
          console.log("Played matches user2: " + playedMatches);
          await this.userService.setOnlineStatus(user2.id);
        }

        this.gameService.matchesService.create(match);
      }
      this.roomsList.delete(roomCheck.id);
    }
  }

  @SubscribeMessage('queuing')
  async waitingForRandomOponent(client: Socket) {
    console.log("Player queuing");

    const user = await this.getUser(client);
    if (!user)
      return;
    const userStatus: string = await this.userService.getStatus(user.id);
    console.log("Status ", userStatus);
    const roomInvitationCheck =
      Array.from(this.roomsList.values()).
        find(room => (room.firstClient === client ||
          room.secondClient === client));

    if (roomInvitationCheck && roomInvitationCheck.gameMode == "private") {
      console.log('Player reserved ');
      return;
    }

    if (userStatus == "busy") {
      console.log("Already queuing");
      this.server.to(`${client.id}`).emit("alreadyQueuing");
      return;
    }
    this.userService.setBusyStatus(user.id);
    for (const room of this.roomsList.values()) {
      if (room.roomState != "invite" && room.gameMode != "robot") {
        if (!room.firstClient) {
          const otherUser = await this.getUser(room.secondClient);

          const isBlocked = await this.userService.getBlockStatus(user.id, otherUser.username);

          if (isBlocked.isBlocked) {
            continue;
          }

          room.firstClient = client;
          room.firstName = user.username;
          room.user1ID = user.id;
          console.log("player " + room.user1ID + "here");
          return;
        }
        else if (!room.secondClient) {
          const otherUser = await this.getUser(room.firstClient);

          const isBlocked = await this.userService.getBlockStatus(user.id, otherUser.username);

          if (isBlocked.isBlocked) {
            continue;
          }


          client.join(`${room.id}`);
          room.secondClient = client;
          room.roomState = "ready";
          room.secondName = user.username;
          room.user2ID = user.id;
          console.log("player " + room.user2ID + "here");
          this.server.to(`${room.id}`).emit("matchFound", true);
          this.server.to(`${room.id}`).emit("gameStart");
          this.server.to(`${room.id}`).emit("userIDs",
            room.user1ID,
            room.user2ID);
          return;
        }
      }
    }
    let room_ = new room();
    room_.id = this.roomID;
    this.roomID++;
    client.join(`${room_.id}`);
    room_.firstClient = client;
    room_.gameMode = "random";
    this.roomsList.set(room_.id, room_);
    room_.firstName = user.username;
    room_.user1ID = user.id;
    console.log("player " + room_.user1ID + "here");
    console.log("Rooms count ", this.roomsList.size);
  }
  @SubscribeMessage('left')
  async leftMove(client: Socket, vel: number) {
    let room = Array.from(this.roomsList.values()).find(room => room.firstClient === client);
    if (room) {
      console.log("LEFT to room ", room.id);
      room.firstvelocity = vel;
    }
  }
  @SubscribeMessage('right')
  async rightMove(client: Socket, vel: number) {
    const room = Array.from(this.roomsList.values()).find(room => room.secondClient === client);
    if (room) {
      console.log("RIGHT to room ", room.id);
      room.secondvelocity = vel;
    }
  }
  @SubscribeMessage('balllaunch')
  async ballLaunch(client: Socket, launched: boolean) {
    const room = Array.from(this.roomsList.values()).find(room => room.secondClient === client ||
      room.firstClient === client);
    if (room) {
      if (room.firstPlayerHaveTheBall && client == room.firstClient) {
        console.log("One");
        room.ballLaunched = launched;
      }
      if (room.secondPlayerHaveTheBall && client == room.secondClient) {
        console.log("Two");
        room.ballLaunched = launched;
      }
    }
  }
}

