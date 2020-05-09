import { Application, IExpressApplication } from "./ExpressAnnotations";
import * as path from "path";

@Application
export class MyApplication implements IExpressApplication {
     public port = 8100;
     public view = path.join(__dirname, '/../views/');
     public session = {
        secret: 'reboot',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    };
}