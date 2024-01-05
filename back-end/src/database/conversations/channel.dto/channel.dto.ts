import { ChannelType } from "@prisma/client";
import { Transform , Exclude} from "class-transformer";
import { IsNotEmpty } from "class-validator";


export class createChanneldto {

  @IsNotEmpty()
  type: ChannelType;

  @IsNotEmpty()
  channelName: string;
  

  @Transform(({ value }) => value ? value : "")
  channelDescription: string;
  
  @Exclude()
  @Transform(({ value }) => console.log("value =>", value))
  channelPassword: string | null;

  constructor(partial: Partial<createChanneldto>) {
    Object.assign(this, partial);
    this.channelDescription = this.channelDescription ? this.channelDescription : "";
    this.channelPassword = this.channelPassword ? this.channelPassword : null;
  }
}