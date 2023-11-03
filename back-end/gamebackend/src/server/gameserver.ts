import {OnModuleInit, Injectable, Controller, Get} from '@nestjs/common'
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import {Server} from 'socket.io'

// Managing the sockets
@WebSocketGateway()
export class gameServer implements OnModuleInit
{
    @WebSocketServer()
    server : Server;
    posx: number = 0;
    posy: number = 0;
    score1: number = 0;
    score2: number = 0;
    firstPaddlePos: number = 0;
    secondPaddlePos: number = 0;
    firstPaddleSpeed: number = 0.01;
    secondPaddleSpeed: number = 0.01;
    firstVelocity:number = 0;
    secondVelocity:number = 0;
    prevPositionsy: number = 0;
    prevPositionsx: number = 0;
    velocityy: number = 0;
    velocityx: number = 0;
    speed: number = 0;
    firstSpeed: number = 0;
    secondSpeed: number = 0;
    ballLaunched: boolean = false;
    firstPlayerHasTheBall: boolean = false;
    secondPlayerHasTheBall: boolean = false;

    onModuleInit()
    {
        this.velocityx = 0.1;
        this.velocityy = 0.1;
        this.speed = 0.01;
        let client1 = '0';
        let client2 = '0';
        this.server.on('connection', (socket) =>
        {
            socket.on('balllaunch', (v) =>{
                this.ballLaunched = v;
            });

            if (client1 == '0' && client2 == '0') {
                client1 = socket.id;
                this.firstPlayerHasTheBall = true;
                this.secondPlayerHasTheBall = false;
            }
            else if (client1 != '0' && client2 == '0') {
                client2 = socket.id;
            }
            if (client2 == socket.id) 
            {
                socket.on('right', (v) => {
                    this.secondVelocity = v;
                });
            }
            if (client1 == socket.id) {
                socket.on('left', (v) =>
                {
                    this.firstVelocity = v;
                });
            }
        })
        
        setInterval(() => {
            // Game Logic
            this.server.emit('ballPosetion', this.firstPlayerHasTheBall, this.secondPlayerHasTheBall);
            if (!this.ballLaunched)
            {
                if (this.firstPlayerHasTheBall)
                {
                    this.posx =  0.97 - 0.05;
                    this.posy =  this.firstPaddlePos;
                    this.velocityx = -1;
                }
                if (this.secondPlayerHasTheBall)
                {
                    this.posx =  -0.97 + 0.05;
                    this.posy =  this.secondPaddlePos;
                    this.velocityx = 1;
                }
            }
            else
            {
                if (this.posx + 0.2/10 >= 0.97 && 
                    this.posy - 0.2/10 <= this.firstPaddlePos + 1/10 &&
                    this.posy + 0.2/10 >= this.firstPaddlePos - 1/10)
                {
                    console.log('collisiooooon');
                    this.firstPlayerHasTheBall = true;
                    this.secondPlayerHasTheBall = false;
                    this.velocityx = -1;
                }
                if (this.posx - 0.2/10 <= -0.97 && 
                    this.posy - 0.2/10 <= this.secondPaddlePos + 1/10 &&
                    this.posy + 0.2/10 >= this.secondPaddlePos - 1/10)
                {
                    console.log('collisiooooon');
                    this.firstPlayerHasTheBall = false;
                    this.secondPlayerHasTheBall = true;
                    this.posx += 0.0001;
                    this.velocityx = 1;
                }
                if (this.posx >= 1)
                {
                    this.score1++;
                    this.firstPlayerHasTheBall = false;
                    this.secondPlayerHasTheBall = true;
                    this.ballLaunched = false;
                    this.secondSpeed =  0.01;
                    this.firstSpeed =  0.01;
                }
                if (this.posx <= -1)
                {
                    this.score2++;
                    this.firstPlayerHasTheBall = true;
                    this.secondPlayerHasTheBall = false;
                    this.ballLaunched = false;
                    this.secondSpeed =  0.01;
                    this.firstSpeed =  0.01;
                }
                if (this.posy >= 7/10)
                {
                    this.posy = 7/10;
                    this.velocityy = -1;
                }
                if (this.posy <= -7/10)
                {
                    this.posy = -7/10;
                    this.velocityy = 1;
                }
            }
            if (this.firstPaddlePos + this.firstPaddleSpeed * this.firstVelocity < 7/10 - 1/10
            && this.firstPaddlePos + this.firstPaddleSpeed * this.firstVelocity > -7/10 + 1/10)
                this.firstPaddlePos += this.firstPaddleSpeed * this.firstVelocity;
                if (this.secondPaddlePos + this.secondPaddleSpeed * this.secondVelocity < 7/10 - 1/10
                && this.secondPaddlePos + this.secondPaddleSpeed * this.secondVelocity > -7/10 + 1/10)
                this.secondPaddlePos += this.secondPaddleSpeed * this.secondVelocity;
                
            this.server.emit('right', this.secondPaddlePos);
            this.server.emit('left', this.firstPaddlePos);

            this.posx += (this.speed * this.velocityx);
            this.posy += (this.speed * this.velocityy);

            this.server.emit('ballPosX', (this.posx));
            this.server.emit('ballPosY', (this.posy));
            this.server.emit('score', this.score1, this.score2);
        }, 1000 / 60);
    }
}
