/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChannelType, Role } from "@prisma/client";

class authorInfo  {
  username: string
  id: number
  role: Role
  usersAuthorBlockedBy: any
}

export class ChannelBroadcastedMsg  {
  id: number
  authorInfo: authorInfo = new authorInfo()
  message: string
  convType: ChannelType
  convId: number
  bannedUsers: any
}