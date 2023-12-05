import {Module} from '@nestjs/common'
import { gameServer } from "./gameserver";

@Module({
    providers : [gameServer] // les service
})
export class serverModule
{
}
