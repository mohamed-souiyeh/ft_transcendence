import {OnModuleInit} from '@nestjs/common'
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import {Server} from 'socket.io'

@WebSocketGateway()
export class gameServer implements OnModuleInit
{
    @WebSocketServer()
    server : Server;

    onModuleInit()
    {
        console.log('ggg');
        let client1 = '0';
        let client2 = '0';
        this.server.on('connection', (socket) =>
        {
            console.log('test');
            if (client1 == '0' && client2 == '0') {
                client1 = socket.id;
                // firstPlayerHasTheBall = true;
                // secondPlayerHasTheBall = false;
            }
            else if (client1 != '0' && client2 == '0') {
                client2 = socket.id;
                // firstPlayerHasTheBall = false;
                // secondPlayerHasTheBall = true;
            }
            if (client2 == socket.id) {
                socket.on('right', (v) => {
                    this.server.emit('right', v);
                    console.log("Player two is moving");
                });
            }
            if (client1 == socket.id) {
                socket.on('left', (v) => {
                    this.server.emit('left', v);
                    console.log("Player one is moving");
                });
            }
        })
    }

    @SubscribeMessage('custom')
    message(@MessageBody() data)
    {
        console.log(data);
    }
}
