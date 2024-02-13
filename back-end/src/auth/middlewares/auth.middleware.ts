import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as url from 'url';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    // console.log('AuthMiddleware');
    // console.log("---------------------------------");
    // console.log("status code => ", req.statusCode);
    // console.log("status message => ", req.statusMessage);
    // console.log("the returned url => ", req.url);

    const parsedUrl = url.parse(req.url, true);
    
    // console.log("paresed query string => ", parsedUrl.query);

    // console.log("query string error => ", parsedUrl.query.error);
    // console.log("query string error_description => ", parsedUrl.query.error_description);
    // console.log("query string code => ", parsedUrl.query.code);

    // console.log("---------------------------------");

    if (parsedUrl.query.error === "access_denied") {
      // res.redirect(301, process.env.LOGIN_URL);
      res.status(301);
      res.setHeader('Location', process.env.LOGIN_URL);
      res.json({ error: "access_denied", message: "Your dumbass have denied access for this application" })
    }
    // console.log(res);
    next();
  }
}
