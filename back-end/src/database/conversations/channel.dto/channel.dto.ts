import { ChannelType } from "@prisma/client";
import { Exclude} from "class-transformer";
import { IsNotEmpty } from "class-validator";


export class createChanneldto {

  @IsNotEmpty()
  type: ChannelType;

  @IsNotEmpty()
  channelName: string;
  

  channelDescription: string;
  
  @Exclude()
  channelPassword: string | null;

  constructor(partial: Partial<createChanneldto>) {
    Object.assign(this, partial);
    this.channelDescription = this.channelDescription ? this.channelDescription : "";
    this.channelPassword = this.channelPassword ? this.channelPassword : null;
  }
}