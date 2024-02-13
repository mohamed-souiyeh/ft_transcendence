import { GatewayMetadata } from "@nestjs/websockets";

export const baseGateWayConfig: GatewayMetadata = {
  cors: {
    origin: `${process.env.REACT_URL}:8082`,
    credentials: true,
  },
  transports: ['websocket', 'polling'],
};