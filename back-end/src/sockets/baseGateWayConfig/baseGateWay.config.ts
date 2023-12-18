import { GatewayMetadata } from "@nestjs/websockets";

export const baseGateWayConfig: GatewayMetadata = {
  cors: {
    origin: true,
    credentials: true,
  },
};