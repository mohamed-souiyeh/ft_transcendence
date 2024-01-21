import { ChannelType } from "@prisma/client"


class userInfo {
  autorId: number
  username: string
}

export class dmBroadcastedMsg {
  id: number
  authorInfo: userInfo = new userInfo()
  message: string
  convType: ChannelType
  convId: number
}