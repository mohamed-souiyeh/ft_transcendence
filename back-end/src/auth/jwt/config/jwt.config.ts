// import { config } from "dotenv";

import { JwtSignOptions } from "@nestjs/jwt";

// config({
//   encoding: 'latin1',
//   debug: true,
//   override: false,
// });


export const jwt_sign_options: JwtSignOptions = {
  secret: process.env['JWT_SECRET'],
  //FIXME - make it back to normal
  expiresIn: 60 * 30000000000000000, // available for 3 mins
};

export const jwt_refresh_sign_options: JwtSignOptions = {
  secret: process.env['JWT_REFRESH_SECRET'],
  expiresIn: '1d', // available for 1 day
};
