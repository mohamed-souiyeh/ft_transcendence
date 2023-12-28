/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChannelType, Role } from "@prisma/client";

class authorInfo  {
  authorUsername: string
  authorid: number
  authorRole: Role
  usersAuthorBlockedBy: any
}

export class ChannelBroadcastedMsg  {
  authorInfo: authorInfo = new authorInfo()
  message: string
  convType: ChannelType
  convId: number
  bannedUsers: any
}