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
import { JwtAuthService } from 'src/auth/jwt/jwt.service';
import { JwtPayload } from 'src/auth/jwt/JwtPayloadDto/JwtPayloadDto';
import { eventBus } from 'src/eventBus';

// Managing the sockets
@WebSocketGateway({
	cors: {
		origin: true,
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
		private userService: UsersService) { }

	onModuleInit() {
		this.gameService.gameLoop(this.server, this.roomsList);
	}

	async handleConnection(client: Socket) {
		 
		console.log("Client connected to gamegateway", client.id);
		let user = await this.gameService.chatService.getUserFromSocket(client);
		if (user == null)
			return;
		let userStatus: string = await this.userService.getStatus(user.id);
		console.log("Status ", userStatus);
		if (userStatus == "busy") {
			console.log("Already queuing");
			this.server.to(`${client.id}`).emit("alreadyQueuing");
			return;
		}
		client.join(`${user.id}`);
	}

	async handleDisconnect(client: Socket) {
		let match = new MatchDto();
		let roomCheck = Array.from(this.roomsList.values())
			.find(room => room.firstClient === client
				|| room.secondClient === client);
		console.log("Leave room from disconnect");
		if (roomCheck) {
			let user1, user2;
			if (roomCheck.firstClient)
				user1 = await this.gameService.chatService.getUserFromSocket(roomCheck.firstClient);
			if (roomCheck.secondClient)
				user2 = await this.gameService.chatService.getUserFromSocket(roomCheck.secondClient);
			this.server.to(`${roomCheck.id}`).emit("leaveGame");
			if (roomCheck.gameMode != "robot") {
				if (roomCheck.firstClient == client) {
					match.winnerId = roomCheck.user1ID;
					match.loserId = roomCheck.user2ID;
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
					match.winnerId = roomCheck.user2ID;
					match.loserId = roomCheck.user1ID;
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
			if (user1)
				this.userService.setOnlineStatus(user1.id);
			if (user2)
				this.userService.setOnlineStatus(user2.id);
			this.roomsList.delete(roomCheck.id);
		}
	}


	@SubscribeMessage('botMode')
	async setGameAsBotMode(client: Socket) {
		await console.log("BOT MODE !!!!!", client);
		let user = await this.gameService.chatService.getUserFromSocket(client);
		if (!user)
			return;
		this.userService.setScore(user.id, 0);

		let room_ = await new room();
		room_.firstClient = client;
		room_.gameMode = "robot";
		room_.roomState = "ready";
		room_.id = this.roomsList.size;
		this.roomsList.set(room_.id, room_);
		client.join(`${room_.id}`);
		console.log("Rooms L ", this.roomsList.size);
		this.server.to(`${room_.id}`).emit("botGame");
	}

	@SubscribeMessage('invite')
	async invitePlayer(client: Socket, invitedUserID: number) 
	{
		let user = await this.gameService.chatService.getUserFromSocket(client); 
		console.log("Invite player");
		if (!user)
		return; 
		if (await this.userService.getStatus(invitedUserID) == "busy") {
			return;
		}
		let room_ = new room();
		room_.id = this.roomsList.size;
		room_.firstClient = client;
		room_.gameMode = "private";
		room_.roomState = "invite";
		console.log("Invite player to room ", room_.id);
		client.join(`${room_.id}`);
		this.roomsList.set(room_.id, room_); 
		eventBus.emit("privateGame", user.id, invitedUserID, room_.id);
	}
	// The triggered event once the user accepts the invite
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
			roomCheck.secondName = await this.gameService.chatService.getUserFromSocket(client).then((user) => {
				return user.username;
			});
			roomCheck.user2ID = await this.gameService.chatService.getUserFromSocket(roomCheck.secondClient).then((user) => {
				return user.id;
			});
			roomCheck.user1ID = await this.gameService.chatService.getUserFromSocket(roomCheck.firstClient).then((user) => {
				return user.id;
			});
		}
	}
	@SubscribeMessage('declinePlayingInvite')
	async declineMatchInvite(client: Socket, roomID: number) {
		// The invited user will decline the invite and the room will be deleted and both users will be disconnected
		let roomCheck = Array.from(this.roomsList.values())
			.find(room => room.id === roomID);
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
		if (roomCheck) {
			let user1, user2;
			if (roomCheck.firstClient)
				user1 = await this.gameService.chatService.getUserFromSocket(roomCheck.firstClient);
			if (roomCheck.secondClient)
				user2 = await this.gameService.chatService.getUserFromSocket(roomCheck.secondClient);
			this.server.to(`${roomCheck.id}`).emit("leaveGame");
			if (roomCheck.gameMode != "robot") {
				if (roomCheck.firstClient == client) {
					match.winnerId = roomCheck.user1ID;
					match.loserId = roomCheck.user2ID;
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
					match.winnerId = roomCheck.user2ID;
					match.loserId = roomCheck.user1ID;
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
			if (user1)
				this.userService.setOnlineStatus(user1.id);
			if (user2)
				this.userService.setOnlineStatus(user2.id);
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
			if (this.roomsList.has(roomCheck.id))
			{
				this.roomsList.get(roomCheck.id).roomState = "gameOver";
				console.log("Set game over now !!");
			}
			if (roomCheck.gameMode != "robot")
			{
				let user1, user2;
				if (roomCheck.firstClient)
					user1 = await this.gameService.chatService.getUserFromSocket(roomCheck.firstClient);
				if (roomCheck.secondClient)
					user2 = await this.gameService.chatService.getUserFromSocket(roomCheck.secondClient);
				if (roomCheck.score1 > roomCheck.score2) {
					console.log("Right");
					match.winnerId = roomCheck.user1ID; 
					match.loserId = roomCheck.user2ID;
					match.endedAt = roomCheck.endTime;
					match.mode = roomCheck.gameMode;
					match.winnerStats = {
						score: roomCheck.score1,
						name: roomCheck.secondName
					};
					match.loserStats = {
						score: roomCheck.score2,
						name: roomCheck.firstName
					};
					this.userService.findUserById(roomCheck.user2ID).then((user) => {
						this.userService.setScore(user.id, user.score + (roomCheck.score1 - roomCheck.score2));
						console.log("Score ", (roomCheck.score1 - roomCheck.score2));
					});
					this.server.to(`${roomCheck.firstClient.id}`).emit("winner", false);
					let user = await this.gameService.chatService.getUserFromSocket(roomCheck.firstClient);
					if (!user)
						return;
				}
				else if (roomCheck.score1 < roomCheck.score2) {
					console.log("Left");
					match.winnerId = roomCheck.user2ID;
					match.loserId = roomCheck.user1ID;
					match.mode = roomCheck.gameMode;
					match.endedAt = roomCheck.endTime;
					match.winnerStats = { score: roomCheck.score2, name: roomCheck.firstName };
					match.loserStats = { score: roomCheck.score1, name: roomCheck.secondName };
					this.userService.findUserById(roomCheck.user1ID).then(async (user) => { 
						await this.userService.setScore(user.id, user.score + (roomCheck.score2 - roomCheck.score1));
						console.log("Score ", (roomCheck.score2 - roomCheck.score1));
					});
					this.server.to(`${roomCheck.secondClient.id}`).emit("winner", false);
					let user = await this.gameService.chatService.getUserFromSocket(roomCheck.secondClient);
					if (!user)
						return;
					this.userService.setOnlineStatus(user.id);
				}
				if (user1)
					this.userService.setOnlineStatus(user1.id);
				if (user2)
					this.userService.setOnlineStatus(user2.id);
				this.gameService.matchesService.create(match);
			}
			this.roomsList.delete(roomCheck.id);
		}
	}

	@SubscribeMessage('queuing')
	async waitingForRandomOponent(client: Socket) {
		console.log("Player queuing");
		let user = await this.gameService.chatService.getUserFromSocket(client);
		if (!user)
			return;
		let userStatus: string = await this.userService.getStatus(user.id);
		console.log("Status ", userStatus);
		if (userStatus == "busy") {
			console.log("Already queuing");
			this.server.to(`${client.id}`).emit("alreadyQueuing");
			return;
		}
		this.userService.setBusyStatus(user.id);
		for (let room of this.roomsList.values()) {
			if (room.roomState != "invite" && room.gameMode != "robot") {
				if (!room.firstClient) {
					room.firstClient = client;
					room.firstName = user.username;
					room.user1ID = user.id;
					console.log("player " + room.user1ID + "here");
					return;
				} else if (!room.secondClient) {
					client.join(`${room.id}`);
					room.secondClient = client;
					room.roomState = "ready";
					room.secondName = user.username;
					room.user2ID = user.id;
					console.log("player " + room.user2ID + "here");
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

