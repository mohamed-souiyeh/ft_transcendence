import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { parse } from 'cookie';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { ChatService } from 'src/sockets/chat/chat.service';
import { room } from './Room';
import { MatchesService } from 'src/database/matches/matches.service';
import { MatchDto } from 'src/database/matches/matches.dto';


@Injectable()
export class gameService
{
    constructor(private readonly authService: AuthService,
                public readonly chatService: ChatService,
                public readonly matchesService: MatchesService) {}
    async paddleCollision(room: room)
    {
        if (room.firstPaddlePos + room.firstPaddleSpeed 
            * room.firstvelocity < 7 / 10 - 1 / 10
            && room.firstPaddlePos + room.firstPaddleSpeed 
            * room.firstvelocity > -7 / 10 + 1 / 10)
            {
                room.firstPaddlePos += room.firstPaddleSpeed 
                * room.firstvelocity;
            }
        if (room.secondPaddlePos + room.secondPaddleSpeed
             * room.secondvelocity < 7 / 10 - 1 / 10
            && room.secondPaddlePos + room.secondPaddleSpeed 
            * room.secondvelocity > -7 / 10 + 1 / 10)
            {
                room.secondPaddlePos += room.secondPaddleSpeed 
                * room.secondvelocity;
            }
    }
    async updateBallDIrection(server:Server, room: room)
    {
        if (room.ballPosX + 0.2 / 10 >= 0.97 &&
            room.ballPosY - 0.2 / 10 <= room.firstPaddlePos + 1 / 10 &&
            room.ballPosY + 0.2 / 10 >= room.firstPaddlePos - 1 / 10) 
        {
            console.log('collisiooooon');
            if (room.speed <= 0.05)
                room.speed += 0.0001;
            if (room.firstPaddleSpeed <= 0.05)
                room.firstPaddleSpeed += 0.0001;
            let y = room.firstPaddlePos - room.ballPosY;
            let x = room.ballPosX - 0.97;
            room.velocityAngle = (Math.random() % 180) * 180/Math.PI;
            console.log("angle ", room.velocityAngle);
            room.ballVelocityX = -1;
        }
        if (room.ballPosX - 0.2 / 10 <= -0.97 && 
            room.ballPosY - 0.2 / 10 <= room.secondPaddlePos + 1 / 10 && 
            room.ballPosY + 0.2 / 10 >= room.secondPaddlePos - 1 / 10) 
        {
            console.log('collisiooooon');
            if (room.speed <= 0.05)
                room.speed += 0.0001;
            if (room.secondPaddleSpeed <= 0.05)
                room.secondPaddleSpeed += 0.0001;
            let y = room.secondPaddlePos - room.ballPosY;
            let x = -room.ballPosX + 0.97;
            room.velocityAngle = (Math.random() % 180) * 180/Math.PI;
            room.ballVelocityX = 1;
        }
        if (room.ballPosX >= 1) {
            room.score1++;
            room.firstPlayerHaveTheBall = false; 
            room.secondPlayerHaveTheBall = true;
            room.ballLaunched = false;
            room.secondPaddleSpeed = 0.01;
            server.to("room" + room.id).emit('balllaunched', false);
        }
        if (room.ballPosX <= -1) {
            room.firstPlayerHaveTheBall = true;
            room.secondPlayerHaveTheBall = false;
            room.score2++;
            room.ballLaunched = false;
            room.secondPaddleSpeed = 0.01;
            server.to("room" + room.id).emit('balllaunched', false);
        }
        if (room.ballPosY >= 7 / 10) {
            room.ballPosY = 7 / 10;
            room.ballVelocityY = -1;
            room.velocityAngle *= -1;
        }
        if (room.ballPosY <= -7 / 10) {
            room.ballPosY = -7 / 10;
            room.ballVelocityY = 1;
            room.velocityAngle *= -1;
        }
    }
    async gameLoop(server:Server, rooms: room[])
    {
        setInterval(() => {
			// Game Logic
			for (var i: number = 0; i < rooms.length; i++) {
				if (rooms[i].roomState == "ready")
				{ 
					this.paddleCollision(rooms[i]);
					if (!rooms[i].ballLaunched) {
						if (rooms[i].firstPlayerHaveTheBall) {
							rooms[i].ballPosX = 0.94 - 0.05;
							rooms[i].ballPosY = rooms[i].firstPaddlePos;
							rooms[i].velocityAngle = 0;
							rooms[i].ballVelocityX = 1;
							rooms[i].ballVelocityY = 1;
						}
						if (rooms[i].secondPlayerHaveTheBall) {
							rooms[i].ballPosX = -0.94 + 0.05;
							rooms[i].ballPosY = rooms[i].secondPaddlePos;
							rooms[i].ballVelocityX = -1;
							rooms[i].ballVelocityY = -1;
							if (rooms[i].gameMode == "robot")
							{
								rooms[i].ballLaunched = true; 
							}
						}
					}
					else {
						if (rooms[i].firstPlayerHaveTheBall)
							server.to("room" + i).emit('balllaunched', true);
						if (rooms[i].secondPlayerHaveTheBall)
							server.to("room" + i).emit('balllaunched', true); 
	
						this.updateBallDIrection(server, rooms[i]);
					}
					if (rooms[i].firstPaddlePos + rooms[i].firstPaddleSpeed * rooms[i].firstvelocity < 7 / 10 - 1 / 10
						&& rooms[i].firstPaddlePos + rooms[i].firstPaddleSpeed * rooms[i].firstvelocity > -7 / 10 + 1 / 10)
						{
							rooms[i].firstPaddlePos += rooms[i].firstPaddleSpeed * rooms[i].firstvelocity;
						}
					if (rooms[i].secondPaddlePos + rooms[i].secondPaddleSpeed * rooms[i].secondvelocity < 7 / 10 - 1 / 10
						&& rooms[i].secondPaddlePos + rooms[i].secondPaddleSpeed * rooms[i].secondvelocity > -7 / 10 + 1 / 10)
						{
							rooms[i].secondPaddlePos += rooms[i].secondPaddleSpeed * rooms[i].secondvelocity; 
						}
	 
					if (rooms[i].gameMode == "robot")
					{
						rooms[i].secondPaddleSpeed = 0.005;
						if (rooms[i].ballPosX < 0.0)
						{
							if (rooms[i].ballPosY > rooms[i].secondPaddlePos + 0.1)
								rooms[i].secondvelocity = 1;
							if (rooms[i].ballPosY < rooms[i].secondPaddlePos - 0.1)
								rooms[i].secondvelocity = -1;
						}
						else
						{
							rooms[i].secondvelocity = 0;
						}
					}
                    else
                    {
                        if (rooms[i].score1 >= 6 || rooms[i].score2 >= 6) 
                        {
                            server.to(i + '').emit('gameover');
                            rooms[i].endTime = new Date();
                            rooms[i].roomState = "ended";
                        }
                    }
	
					rooms[i].ballPosX += (rooms[i].speed
                                        * Math.cos(rooms[i].velocityAngle * Math.PI/180) 
                                        * rooms[i].ballVelocityX);
					rooms[i].ballPosY += (rooms[i].speed
                                        * Math.sin(rooms[i].velocityAngle * Math.PI/180) 
                                        * rooms[i].ballVelocityY);
					server.to(i + '').emit('ballPosX', (rooms[i].ballPosX));
					server.to(i + '').emit('ballPosY', (rooms[i].ballPosY));
					server.to(i + '').emit('score', rooms[i].score1, rooms[i].score2);
					server.to(i + '').emit('left', rooms[i].firstPaddlePos);
					server.to(i + '').emit('right', rooms[i].secondPaddlePos); 
					server.to(i + '').emit('matchFound', true);
					server.to(i + '').emit('ballPosetion', rooms[i].firstPlayerHaveTheBall, rooms[i].secondPlayerHaveTheBall);
				}
			}
		}, 1000 / 60);
    }
}
 