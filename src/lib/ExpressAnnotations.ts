import express = require("express"); 
import session = require("express-session"); 
import bodyParser = require("body-parser");
import * as path from "path";
enum RequestMethod {
    Get = 'get',
    Post = 'post',
    Delete = 'delete',
    Put = 'put',
}

type MiddleWare = (req: express.Request, res: express.Response, next: express.NextFunction) => void;

const sesScope: MiddleWare = function (req, res, next) {
    next();
}

class ExpressApplication {
    public app: express.Application = express();
    private main: IExpressApplication | undefined; // call this configuration instead
    public container: {[key: string]: any} = {};
    public constructor() {}
    public setApplication(obj: IExpressApplication) {
        this.main = obj;
        const port = this.main ? this.main.port : 8080;
        this.app.use(bodyParser.json());
        this.app.use(sesScope);
        this.app.set('view engine', 'pug');
        this.app.set('views', this.main.view);
        // remove block below
        console.log(path.join(__dirname, '../..', 'lib'));
        this.app.use(express.static(path.join(__dirname, '../..', 'lib')))
        // remove block above
        if(this.main && this.main.session){
            this.app.use(session(this.main.session));
        }
        this.app.listen(port, function() {
            console.log("Application started on port: " + port);
        });
    }
    public getApplication(): IExpressApplication | undefined {
        return this.main;
    }
}

export const expressApplication = new ExpressApplication();

export function Application(target: any) {
    expressApplication.setApplication(new target());
}

export function Controller(target: any) {}

export function Request(
         method: RequestMethod,
         route: string
       ) {
        return function (target: any, name: string, pd: PropertyDescriptor) {
           const app = expressApplication.app;
           if (app !== undefined) {
             console.log("registered " + route);
             app[method](route, function(req, res) {
                const ans = target[name](req);
                if ( ans.view ) {
                    res.render(ans.view, ans.param);
                } else {
                    res.send(ans);
                }
               
             });
           }
       }
    }

export function Get(route: string) {
    return Request(RequestMethod.Get, route);
}

export function Post(route: string) {
  return Request(RequestMethod.Post, route);
}

export interface IExpressApplication {
    port: number;
    ssl?: {[key: string] : string};
    session?: any;
    view: string;
}

export function use(target: any) {
  const test = new target();
  console.log(test);
}