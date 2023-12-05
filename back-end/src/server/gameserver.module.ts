import {Module} from '@nestjs/common'
import { gameServer } from "./gamegateway";
import { gameController } from './game.controller';

@Module({
    providers : [gameServer],
    controllers:[gameController]
})
export class gameModule
{
}
