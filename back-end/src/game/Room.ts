import { Socket } from 'socket.io';

export class room {
	id: number = 0;
	user1ID: number = 0;
	user2ID: number = 0;
	firstClient: Socket = null;
	secondClient: Socket = null;
	firstName: string = null;
	secondName: string = null;
	firstPaddlePos: number = 0;
	secondPaddlePos: number = 0;
	firstPaddleSpeed: number = 0.01;
	secondPaddleSpeed: number = 0.01; 
	firstvelocity: number = 0;
	secondvelocity: number = 0;
	ballPosX: number = 0;
	ballPosY: number = 0;
	ballVelocityX: number = 0;
	ballVelocityY: number = 0;
	velocityAngle: number = 0;
	score1: number = 0;
	score2: number = 0;  
	speed: number = 0.01;
	ballLaunched: boolean = false;
	firstPlayerHaveTheBall: boolean = true;
	secondPlayerHaveTheBall: boolean = false;
	foundMatch: boolean = false;
	roomsName: string = null;
	roomState: string = null;		// Either random or waiting for someone specific
	gameMode: string = null;		// Playing with real players or with bot
    matchTime: number = 60;
	endTime: Date;
};
