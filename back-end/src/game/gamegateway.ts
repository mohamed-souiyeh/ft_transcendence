import {
	OnModuleInit
}
	from '@nestjs/common';
import {
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
}
	from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/database/users/users.service';
import { gameService } from './game.service';
import { AuthService } from 'src/auth/auth.service';
import { parse } from 'cookie';
import {room} from './Room';
import { MatchDTO } from './dto/matchDTO';
import { match } from 'assert';
import { MatchDto } from 'src/database/matches/matches.dto';

//TODO - okay daba khassed function dyal creation dyal lmatch tweli tsuporti winner and loser states and khassed function bach t updati scores dyal cola player and how many matches le3bo? ghan7awel ndirhom f function we7da dyal creation
// what else u can work on now
// okay binma ngadlik leblan i need u to stitch somthing for me
// i want an app just like the one u made ghir tkon 3ando interface where i can see what is emeted by the sockets
// littraly the whole shit
// veeeeery simple one
// ana ghadi nemmiti object fih author and msg and other info
// o want to see all that
// just stringfy that obbject and spit it out on the screen
// it would be good if there is a dm space and a chanell space
// and i can chouse with what user i will send the msg



// Managing the sockets
@WebSocketGateway({ cors: {origin:"http://localhost:8082",
							credentials:true}})
export class gameServer implements OnModuleInit {
	@WebSocketServer()
	server: Server;

	roomsList: room[] = new Array<room>();
	connectedUsers: string[] = new Array<string>();


	constructor(private authService: AuthService,
				private gameService: gameService,
				private userService: UsersService)
	{}

	onModuleInit() {
		this.gameService.gameLoop(this.server, this.roomsList);
	}

	async handleConnection(client: Socket) {
		// NOTE get the users informations from the socket here and store them in an array so that if the same user try to connect to the gateway he won't be allowed
		let matchDTO:MatchDto = new MatchDto();
		matchDTO.mode = "random";
		matchDTO.winnerStats = {};
		matchDTO.loserStats = {};
		matchDTO.winnerId = 1;
		matchDTO.loserId = 4;

		// failat ra returnat null 7it mal9atch l user tani li ghadii tlinki lih wach nta baghi tlinki user with id 1 m3a lberd?
		try
		{
			await this.gameService.matchesService.create(matchDTO);
		}
		catch (e)
		{
			console.log(e);
		}
		let user = await this.gameService.chatService.getUserFromSocket(client); 
		if (this.connectedUsers.includes(user.username))
		{
			client.disconnect();
			return ;
		}
		console.log("This man is ", user.username);
		if (this.roomsList.length == 0)
		{
			let room_ = new room();
			room_.id = 0;
			room_.firstClient = client;
			room_.gameMode = "random";
			room_.roomState = "queuing";
			this.roomsList.push(room_);
			client.join(`${room_.id}`);
		}
		// console.log(username);
		this.connectedUsers.push(user.username);
	}

	async handleDisconnect(client: Socket)
	{
		let user = await this.gameService.chatService.getUserFromSocket(client);
		this.connectedUsers.splice(this.connectedUsers.indexOf(user.username), 1);
		let roomCheck = await this.roomsList.find(room => room.firstClient === client || room.secondClient === client);
		if (roomCheck)
		{
			if (roomCheck.firstClient && roomCheck.secondClient)
			{
				// Set the winner on the database depending on the score
				// this.gameService.matchesService.
			}
			this.server.to(`${roomCheck.id}`).emit("leaveGame");
			this.roomsList.splice(this.roomsList.indexOf(roomCheck), 1);
		} 
	}

	// NOTE - set the player status in the database to busy using the user service
	@SubscribeMessage('botMode')
	async setGameAsBotMode(client: Socket) 
	{
		let user = await this.gameService.chatService.getUserFromSocket(client);
		if (this.connectedUsers.includes(user.username))
		{
			client.disconnect();
			return ;
		}
		await console.log("BOT MODE !!!!!", client.id);

		let room_= new room();
		// room_.firstName = user.username;
		room_.firstClient = client;
		room_.gameMode = "robot";
		room_.roomState = "ready";
		room_.id = this.roomsList.length;
		this.roomsList.push(room_);
		client.join(`${room_.id}`);
		console.log("Rooms ", room_.id);
		this.server.to(`${room_.id}`).emit("botGame");
	}
	@SubscribeMessage('invite')
	async invitePlayer(client: Socket, invitedUser: string)
	{
		// Check if the invited user is already in a game if he is return and don't create a new room
		let room_ = new room();
		room_.id = this.roomsList.length + 1;
		room_.firstClient = client;
		room_.roomState = "invite";
		this.roomsList.push(room_);
	}
	// The triggered event once the user accepts the invite
	@SubscribeMessage('acceptPlayingInvite')
	async acceptMatchInvite(client: Socket, roomID: number)
	{
		// The invited user will join the room by it's id and a match will start
	}
	@SubscribeMessage('declinePlayingInvite')
	async declineMatchInvite(client: Socket, roomID: number)
	{
		// The invited user will decline the invite and the room will be deleted and both users will be disconnected
		let roomToDelete = this.roomsList.find(room => room.id === roomID);
		if (roomToDelete)
		{
			this.roomsList.splice(this.roomsList.indexOf(roomToDelete), 1);
		}
	}
	@SubscribeMessage('leaveRoom')
	async leaveMatch(client: Socket, roomID:number)
	{
		// Emit an event to all players connected to the room that the match is done
		this.server.to(`${client.id}`).emit("leaveGame");
		// client.disconnect();
	}
	@SubscribeMessage('queuing')
	async waitingForRandomOponent(client: Socket)
	{
		let user = await this.gameService.chatService.getUserFromSocket(client);
		if (this.connectedUsers.includes(user.username))
		{
			client.disconnect();
			return ;
		}
		console.log("Player queuing");
		for (let i = 0 ; i < this.roomsList.length; i++)
		{
			if (this.roomsList[i].roomState != "invite" && this.roomsList[i].gameMode != "robot")
			{
				if (!this.roomsList[i].firstClient)
				{
					this.roomsList[i].firstClient = client;
					return ;
				}
				else if (!this.roomsList[i].secondClient)
				{
					client.join(`${this.roomsList[i].id}`);
					this.roomsList[i].secondClient = client;
					this.roomsList[i].roomState = "ready";
					console.log("player 2 here");
					// NOTE - set the player status in the database to busy using the user service
					this.server.to(`${this.roomsList[i].id}`).emit("matchFound", true);
					return ;
				}
			}
		}
		let room_ = new room();
		room_.id = this.roomsList.length;
		client.join(`${room_.id}`);
		room_.firstClient = client;
		room_.gameMode = "random";
		this.roomsList.push(room_);
		this.connectedUsers.push(user.username);
		console.log("Rooms count ", this.roomsList.length);
	}
	@SubscribeMessage('left')
	async leftMove(client: Socket, vel: number)
	{
		const room = this.roomsList.find(room => room.firstClient === client);
		if (room)
		{
			console.log("LEFT");
			room.firstvelocity = vel;
		}
	}
	@SubscribeMessage('right')
	async rightMove(client: Socket, vel: number)
	{
		const room = this.roomsList.find(room => room.secondClient === client);
		if (room)
		{
			console.log("RIGHT");
			room.secondvelocity = vel;
		}
	}
	@SubscribeMessage('balllaunch')
	async ballLaunch(client: Socket, launched: boolean) 
	{
		const room = this.roomsList.find(room => room.firstClient === client 
				|| room.secondClient === client);
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

