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
type RequestMethodType = "get" | "post" | "put" | "delete";

interface RegistryObject {
    route: string,
    method: RequestMethodType,
    value: (req: express.Request, res: express.Response) => void,
    middleware?: MiddleWare
}

const registry: {[key: string]: RegistryObject[]} = {};

const sesScope: MiddleWare = function (req, res, next) {
    next();
}

export interface IExpressApplication {
    port: number;
    ssl?: {[key: string] : string};
    session?: any;
    view: string;
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
        this.app.use(express.static(path.join(__dirname, '../..', 'lib')))
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

const relayMiddleware: MiddleWare = function(req: express.Request, res: express.Response, next: express.NextFunction) {
    // get the method that was called and retrieve its middleware
    // execute that middle ware and run!
    next();
}

export function Controller(path?: string, middleware?: MiddleWare) {
    return function(target: any) {
        const controllerRegistry = registry[target.name];
        const app = expressApplication.app;
        const router = express.Router();
        if (middleware) {
            router.use(middleware);
        }
        router.use(relayMiddleware);
        app.use(path || "/", router);
        for(let o in controllerRegistry) {
           const entry = controllerRegistry[o];
           router[entry.method](entry.route, entry.value);
        }
    }
}

export function Request(
         method: RequestMethod,
         route: string,
         middleware?: MiddleWare
       ) {
        return function (target: any, name: string, pd: PropertyDescriptor) {
            if (!registry[target.constructor.name]) {
                registry[target.constructor.name] = [];
            }
            registry[target.constructor.name].push({
                route: route,
                method: method as RequestMethodType,
                value: function(req: any, res: any) {
                    const ans = target[name](req);
                    if ( ans.view ) {
                        res.render(ans.view, ans.param);
                    } else {
                        res.send(ans);
                    }
                   
                 },
                 middleware: middleware
            });
       }
    }

export function Get(route: string) {
    return Request(RequestMethod.Get, route);
}

export function Post(route: string) {
  return Request(RequestMethod.Post, route);
}

export function use(target: any) {
  const test = new target();
  console.log(test);
}