import { ChannelType } from "@prisma/client"


class userInfo {
  autorId: number
  username: string
}

export class dmBroadcastedMsg {
  userInfo: userInfo = new userInfo()
  message: string
  convType: ChannelType
  convId: number
}