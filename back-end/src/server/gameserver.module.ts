import {Module} from '@nestjs/common'
import { gameServer } from "./gameserver";

@Module({
    providers : [gameServer]
})
export class serverModule
{
}
