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

// Managing the sockets
@WebSocketGateway({
	cors: {
		origin: "http://localhost:8082", 
		credentials: true
	},
	namespace: '/game'
})
export class gameServer implements OnModuleInit {
	@WebSocketServer()
	server: Server;

	roomsList: Map<number, room> = new Map<number, room>();

	constructor(
		private gameService: gameService,
		private userService: UsersService) 
		{ }

	onModuleInit() {
		this.gameService.gameLoop(this.server, this.roomsList); 
	}

	async handleConnection(client: Socket) {
		console.log("Client connected", client.id);
		// try {
		// 	let user = await this.gameService.chatService.getUserFromSocket(client);
		// 	if (await this.userService.getStatus(user.id) == "busy")
		// 	{
		// 		this.server.to(`${client.id}`).emit("alreadyQueuing");
		// 		client.disconnect();
		// 		return ;
		// 	}
		// }
		// catch (e) {
		// 	console.log(e);
		// }
	}

	async handleDisconnect(client: Socket) {
		console.log("Client disconnected", client.id);
		console.log("Rooms length", this.roomsList.size);
		let roomCheck = Array.from(this.roomsList.values()).find(room => room.firstClient === client || room.secondClient === client);
		if (roomCheck)
		{
			this.server.to(`${roomCheck.id}`).emit("leaveGame");
			this.roomsList.delete(roomCheck.id);
		} 
		try {
			let user = await this.gameService.chatService.getUserFromSocket(client);
			// this.userService.setOfflineStatus(user.id);
		}
		catch (e) {
			console.log(e);
		}
	}

	@SubscribeMessage('botMode')
	async setGameAsBotMode(client: Socket) {
		await console.log("BOT MODE !!!!!", client);
		try
		{
			let user = await this.gameService.chatService.getUserFromSocket(client);

			// if(await this.userService.getStatus(user.id) == "busy")
			// {
			// 	this.server.to(`${client.id}`).emit("alreadyQueuing");
			// 	return ;
			// }

			this.userService.setBusyStatus(user.id);
			this.userService.setScore(user.id, 0);

			let room_= await new room();
			room_.firstClient = client;
			room_.gameMode = "robot";
			room_.roomState = "ready";
			room_.id = this.roomsList.size;
			this.roomsList.set(room_.id, room_);
			client.join(`${room_.id}`);
			console.log("Rooms L ", this.roomsList.size);
			this.server.to(`${room_.id}`).emit("botGame");
		}
		catch (e)
		{
			console.log("oops");
			console.log(e);
			return ;
		}
	}
	@SubscribeMessage('invite')
	async invitePlayer(client: Socket, invitedUser: string) {
		try
		{
			let user = await this.gameService.chatService.getUserFromSocket(client);
			if(await this.userService.getStatus(user.id) == "busy")
			{
				this.server.to(`${client.id}`).emit("alreadyQueuing");
				return ;
			}
		}
		catch (e)
		{
			console.log(e);
			return ;
		}
		let room_ = new room();
		room_.id = this.roomsList.size + 1;
		room_.firstClient = client;
		room_.roomState = "invite";
		this.roomsList.set(room_.id, room_);
	}
	// The triggered event once the user accepts the invite
	@SubscribeMessage('acceptPlayingInvite')
	async acceptMatchInvite(client: Socket, roomID: number) {
		// The invited user will join the room by it's id and a match will start
	}
	@SubscribeMessage('declinePlayingInvite')
	async declineMatchInvite(client: Socket, roomID: number) {
		// The invited user will decline the invite and the room will be deleted and both users will be disconnected
		if (this.roomsList.has(roomID)) {
			this.roomsList.delete(roomID);
		}
	}
	@SubscribeMessage('leaveRoom')
	async leaveMatch(client: Socket) {
		let match = new MatchDto();
		let roomCheck = Array.from(this.roomsList.values()).find(room => room.firstClient === client || room.secondClient === client);
		if (roomCheck)
		{
			this.server.to(`${roomCheck.id}`).emit("leaveGame");
			if (roomCheck.gameMode != "robot")
			{
				if (roomCheck.firstClient == client)
				{
					match.winnerId = roomCheck.user1ID;
					match.loserId = roomCheck.user2ID;
					match.endedAt = roomCheck.endTime;
					match.mode = roomCheck.gameMode;
					match.winnerStats = {score: roomCheck.score2, 
										 name: roomCheck.secondName};
					match.loserStats = {score: roomCheck.score1, 
										 name: roomCheck.firstName};
					this.userService.findUserById(roomCheck.user2ID).then((user) => 
					{
						if (user)
						{
							this.userService.setScore(user.id, user.score + (roomCheck.score1 - roomCheck.score2));
						}
					});
				}
				else if (roomCheck.secondClient == client)
				{
					match.winnerId = roomCheck.user2ID;
					match.loserId = roomCheck.user1ID;
					match.mode = roomCheck.gameMode;
					match.endedAt = roomCheck.endTime;
					match.winnerStats = {score: roomCheck.score1, 
										 name: roomCheck.firstName};
					match.loserStats = {score: roomCheck.score2, 
										 name: roomCheck.secondName};
					this.userService.findUserById(roomCheck.user1ID).then((user) => 
					{
						this.userService.setScore(user.id, user.score + (roomCheck.score2 - roomCheck.score1));
					});
				}
				if (match.winnerId && match.loserId)
					this.gameService.matchesService.create(match);
			}
			{
				try
				{
					let user = await this.gameService.chatService.getUserFromSocket(client);
					// Calculate score
					if (roomCheck.gameMode == "robot")
					{
						let score = await this.userService.getScore(user.id);
						console.log("Scoreeee ", score);
						score++;
						console.log("Scoreeee ", score);
						this.userService.setScore(user.id, score);
					}
					// this.userService.setOfflineStatus(user.id);
				}
				catch (e)
				{
					console.log(e);
				}
				// this.server.to(`${roomCheck.id}`).emit("leaveGame");
				this.roomsList.delete(roomCheck.id);
			}
		}
		// Emit an event to all players connected to the room that the match is done
		// client.disconnect();
	}
	@SubscribeMessage('gameOver')
	async gameOver(client: Socket) {
		let match = new MatchDto();
		let roomCheck = Array.from(this.roomsList.values()).find(room => room.secondClient === client ||
			room.firstClient === client);
		console.log("Game over"); 
		if (roomCheck)
		{
			if(roomCheck.gameMode != "robot")
			{
				if (roomCheck.score1 > roomCheck.score2)
				{
					console.log("Right");
					match.winnerId = roomCheck.user1ID;
					match.loserId = roomCheck.user2ID;
					match.endedAt = roomCheck.endTime;
					match.mode = roomCheck.gameMode;
					match.winnerStats = {score: roomCheck.score1, 
										 name: roomCheck.secondName};
					match.loserStats = {score: roomCheck.score2, 
										 name: roomCheck.firstName};
					this.userService.findUserById(roomCheck.user2ID).then((user) => {
						this.userService.setScore(user.id, user.score + (roomCheck.score1 - roomCheck.score2));
						console.log("Score ", (roomCheck.score1 - roomCheck.score2));
					});
					this.server.to(`${roomCheck.firstClient.id}`).emit("winner", false);
				}
				else if (roomCheck.score1 < roomCheck.score2)
				{
					console.log("Left");
					match.winnerId = roomCheck.user2ID;
					match.loserId = roomCheck.user1ID;
					match.mode = roomCheck.gameMode;
					match.endedAt = roomCheck.endTime;
					match.winnerStats = {score: roomCheck.score2, name: roomCheck.firstName};
					match.loserStats = {score: roomCheck.score1, name: roomCheck.secondName};
					this.userService.findUserById(roomCheck.user1ID).then((user) => 
					{
						this.userService.setScore(user.id, user.score + (roomCheck.score2 - roomCheck.score1));
						console.log("Score ", (roomCheck.score2 - roomCheck.score1));
					});
					this.server.to(`${roomCheck.secondClient.id}`).emit("winner", false);
				}
				this.gameService.matchesService.create(match);
			}
			this.roomsList.delete(roomCheck.id);
		}
	}

	@SubscribeMessage('queuing')
	async waitingForRandomOponent(client: Socket) {
		console.log("Player queuing");
		// try{
		// 	let user = await this.gameService.chatService.getUserFromSocket(client);
		// 	let userStatus:string = await this.userService.getStatus(user.id);
		// 	if (userStatus == "busy")
		// 	{
		// 		this.server.to(`${client.id}`).emit("alreadyQueuing");
		// 		client.disconnect();
		// 		return ;
		// 	}
		// }
		// catch (e)	{
		// 	console.log(e);
		// 	client.disconnect();
		// 	return ;
		// }
		for (let room of this.roomsList.values()) {
			if (room.roomState != "invite" && room.gameMode != "robot") {
			  if (!room.firstClient) {
				room.firstClient = client;
				try {
				  let user = await this.gameService.chatService.getUserFromSocket(client);
				  room.firstName = user.username;
				  room.user1ID = user.id;
				  this.userService.setBusyStatus(user.id);
				  console.log("player " + room.user1ID + "here");
				} catch (e) {
				  console.log(e);
				  client.disconnect();
				  return;
				}
				return;
			  } else if (!room.secondClient) {
				client.join(`${room.id}`);
				room.secondClient = client;
				room.roomState = "ready";
				try {
				  let user = await this.gameService.chatService.getUserFromSocket(client);
				  room.secondName = user.username;
				  room.user2ID = user.id;
				  this.userService.setBusyStatus(user.id);
				  console.log("player " + room.user2ID + "here");
				} catch (e) {
				  console.log(e);
				  client.disconnect();
				  return;
				}
				this.server.to(`${room.id}`).emit("matchFound", true);
				return;
			  }
			}
		  }
		let room_ = new room();
		room_.id = this.roomsList.size;
		client.join(`${room_.id}`);
		room_.firstClient = client;
		room_.gameMode = "random";
		this.roomsList.set(room_.id, room_);
		try
		{
			let user = await this.gameService.chatService.getUserFromSocket(client);
			room_.firstName = user.username;
			room_.user1ID = user.id;
			this.userService.setBusyStatus(user.id);
			console.log("player " + room_.user1ID + "here");
		}
		catch (e)
		{
			console.log(e);
			client.disconnect();
			return ;
		}
		// this.connectedUsers.push(user.username);
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

