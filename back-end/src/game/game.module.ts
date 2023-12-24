import { Module } from '@nestjs/common'
import { gameServer } from "./gamegateway";
import { gameController } from './game.controller';
import { UsersService } from 'src/database/users/users.service';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { gameService } from './game.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthService } from 'src/auth/jwt/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from 'src/sockets/chat/chat.service';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { ChatModule } from 'src/sockets/chat/chat.module';
import { AuthModule } from 'src/auth/auth.module';
import { MatchesModule } from 'src/database/matches/matches.module';
import { UsersModule } from 'src/database/users/users.module';

@Module({
    imports: [MatchesModule, ChatModule, AuthModule, UsersModule],
    providers: 
        [gameServer,
         gameService,
         ChatService],
    controllers: [gameController]
})
export class gameModule {
}
// u forgot an await XD