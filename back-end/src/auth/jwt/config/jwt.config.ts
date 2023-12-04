// import { config } from "dotenv";

// config({
//   encoding: 'latin1',
//   debug: true,
//   override: false,
// });

export const jwt_expire_time = {
  expiresIn: 60 * 60 * 12, // available for 12hrs
};


// function debug(envVariable: string): string {
//   console.log("envVariable: ", envVariable);
//   console.log('jwt_expire_time: ', process.env['JWT_EXPIRATON_TIME']);
//   return envVariable;
// }