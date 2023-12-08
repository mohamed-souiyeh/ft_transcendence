// import { config } from "dotenv";

import { JwtSignOptions } from "@nestjs/jwt";

// config({
//   encoding: 'latin1',
//   debug: true,
//   override: false,
// });

export const jwt_sign_options: JwtSignOptions = {
  secret: process.env['JWT_SECRET'],
  expiresIn: 60 * 1, // available for 5mins
};

export const jwt_refresh_sign_options: JwtSignOptions = {
  secret: process.env['JWT_REFRESH_SECRET'],
  expiresIn: '1d', // available for 7days
};
