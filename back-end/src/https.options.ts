import * as fs from 'fs';
import { join } from 'path';



export const httpsOptions = {
  key: fs.readFileSync(join(process.env.HOME, process.env.PRIVATE_KEY_PATH)),
  cert: fs.readFileSync(join(process.env.HOME, process.env.PUBLIC_CERT_PATH)),
};
