import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { ChatService } from 'src/sockets/chat/chat.service';
import { room } from './Room';
import { MatchesService } from 'src/database/matches/matches.service';


@Injectable()
export class gameService
{
    constructor(public readonly chatService: ChatService,
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
            // console.log('collisiooooon');
            // if (room.speed <= 0.05)
            //     room.speed += 0.001;
            if (room.firstPaddleSpeed <= 0.05)
                room.firstPaddleSpeed += 0.0001;
            let y = room.firstPaddlePos - room.ballPosY;
            let x = room.ballPosX - 0.97;
            room.velocityAngle = (Math.random() % 180) * 180/Math.PI;
            // console.log("angle ", room.velocityAngle);
            room.ballVelocityX = -1;
        }
        if (room.ballPosX - 0.2 / 10 <= -0.97 && 
            room.ballPosY - 0.2 / 10 <= room.secondPaddlePos + 1 / 10 && 
            room.ballPosY + 0.2 / 10 >= room.secondPaddlePos - 1 / 10) 
        {
            // console.log('collisiooooon');
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
    async gameLoop(server:Server, rooms: Map<number, room>)
    {
        setInterval(() => {
			// Game Logic
			for (let room of rooms.values()) {
				if (room.roomState == "ready")
				{ 
					this.paddleCollision(room);
					if (!room.ballLaunched) {
						if (room.firstPlayerHaveTheBall) {
							room.ballPosX = 0.94 - 0.05;
							room.ballPosY = room.firstPaddlePos;
							room.velocityAngle = 0;
							room.ballVelocityX = -1;
							room.ballVelocityY = -1;
						}
						if (room.secondPlayerHaveTheBall) {
							room.ballPosX = -0.94 + 0.05;
							room.ballPosY = room.secondPaddlePos;
							room.ballVelocityX = 1;
							room.ballVelocityY = 1;
							if (room.gameMode == "robot")
							{
								room.ballLaunched = true; 
							}
						}
					}
					else {
						this.updateBallDIrection(server, room);
					}
					if (room.firstPaddlePos + room.firstPaddleSpeed * room.firstvelocity < 7 / 10 - 1 / 10
						&& room.firstPaddlePos + room.firstPaddleSpeed * room.firstvelocity > -7 / 10 + 1 / 10)
						{
							room.firstPaddlePos += room.firstPaddleSpeed * room.firstvelocity;
						}
					if (room.secondPaddlePos + room.secondPaddleSpeed * room.secondvelocity < 7 / 10 - 1 / 10
						&& room.secondPaddlePos + room.secondPaddleSpeed * room.secondvelocity > -7 / 10 + 1 / 10)
						{
							room.secondPaddlePos += room.secondPaddleSpeed * room.secondvelocity; 
						}
	 
					if (room.gameMode == "robot")
					{
						room.secondPaddleSpeed = 0.005;
						if (room.ballPosX < 0.0)
						{
							if (room.ballPosY > room.secondPaddlePos + 0.1)
								room.secondvelocity = 1;
							if (room.ballPosY < room.secondPaddlePos - 0.1)
								room.secondvelocity = -1;
						}
						else
						{
							room.secondvelocity = 0;
						}
					}
                    else
                    {
                        if (room.score1 >= 3 || room.score2 >= 3)
                        {
                            server.to(room.id + '').emit('gameover');
                            room.endTime = new Date();
                            room.roomState = "ended";
                        }
                    }
	
					room.ballPosX += (room.speed
                                        * Math.cos(-room.velocityAngle * Math.PI/180)
                                        * room.ballVelocityX);
					room.ballPosY += (room.speed
                                        * Math.sin(room.velocityAngle * Math.PI/180) 
                                        * room.ballVelocityY);

                    {
                        // console.log(`${room.id}`);
                        server.to(`${room.id}`).emit('ballPosX', (room.ballPosX));
                        server.to(`${room.id}`).emit('ballPosY', (room.ballPosY));
                        server.to(`${room.id}`).emit('score', room.score1, room.score2);
                        server.to(`${room.id}`).emit('left', room.firstPaddlePos);
                        server.to(`${room.id}`).emit('right', room.secondPaddlePos);
                        server.to(`${room.id}`).emit('matchFound', true);
                        server.to(`${room.id}`).emit('ballPosetion', room.firstPlayerHaveTheBall, room.secondPlayerHaveTheBall);
                    }
				}
			}
		}, 1000 / 60);
    }
}
 