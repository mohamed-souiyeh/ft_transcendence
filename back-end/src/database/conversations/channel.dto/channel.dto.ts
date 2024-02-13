import { ChannelType } from "@prisma/client";
import { Exclude} from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";


export class createChanneldto {

  @IsNotEmpty()
  type: ChannelType;

  @IsNotEmpty()
  channelName: string;
  
  @IsOptional()
  channelDescription: string;

  @IsOptional()
  id : number;

  @Exclude()
  channelPassword: string | null;

  @IsOptional()
  members: any[];

  constructor(partial: Partial<createChanneldto>) {
    Object.assign(this, partial);
    this.channelDescription = this.channelDescription ? this.channelDescription : "";
    this.channelPassword = this.channelPassword ? this.channelPassword : null;
  }
}