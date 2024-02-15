import { Module } from '@nestjs/common'
import { gameServer } from "./gamegateway";
import { gameController } from './game.controller';
import { gameService } from './game.service';
import { JwtAuthService } from 'src/auth/jwt/jwt.service';
import { ChatService } from 'src/sockets/chat/chat.service';
import { ChatModule } from 'src/sockets/chat/chat.module';
import { AuthModule } from 'src/auth/auth.module';
import { MatchesModule } from 'src/database/matches/matches.module';
import { UsersModule } from 'src/database/users/users.module';
import { JwtAuthModule } from 'src/auth/jwt/jwt-auth.module';

@Module({
    imports: [MatchesModule, ChatModule, AuthModule, UsersModule, JwtAuthModule],
    providers: 
        [gameServer,
         gameService,
         ChatService,
         JwtAuthService,],
    controllers: [gameController]
})
export class gameModule {
}
// u forgot an await XD