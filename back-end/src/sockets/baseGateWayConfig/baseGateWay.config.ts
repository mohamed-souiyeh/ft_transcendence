import { GatewayMetadata } from "@nestjs/websockets";

export const baseGateWayConfig: GatewayMetadata = {
  cors: {
    origin: "http://localhost:8082",
    credentials: true,
  },
  transports: ['websocket', 'polling'],
};