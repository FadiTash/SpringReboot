import express = require("express"); 
import session = require("express-session"); 
import bodyParser = require("body-parser");

enum RequestMethod {
    Get = 'get',
    Post = 'post',
    Delete = 'delete',
    Put = 'put',
}

enum Scope {
    Application,
    Session,
    Request,
}
class DuplicateINameError extends Error {
    public constructor(iName: string){
        super(`This item ${iName} already exists as an Application scoped object`);
    }
}
class InvalidINameError extends Error {
    public constructor(iName: string){
        super(`Session of ${iName} is not available in the container`);
    }
}
class Container {
    public applicationScope: {[key: string]: any} = {};
    public sessionScope: {[key: string]: any} = {};
    public requestScope: {[key: string]: any} = {};
    public constructor() {

    }

    public set(iName: string, Ob: any, scope?: Scope) {
        let targetMap = this.applicationScope;
        switch(scope){
            case Scope.Session:
                targetMap = this.sessionScope;
                break;
            case Scope.Request:
                targetMap = this.requestScope;
                break;
            case Scope.Application:
            default:
                break;
        }
        if (targetMap[iName]) {
          throw new DuplicateINameError(iName);
        }
        targetMap[iName] = Ob;
    }

    public get(iName: string, scope?: Scope): any {
        switch (scope) {
          case Scope.Session:
            if (this.sessionScope[iName]) {
              throw new InvalidINameError(iName);
            }
            return this.sessionScope[iName];
          case Scope.Request:
            if (this.requestScope[iName]) {
              throw new InvalidINameError(iName);
            }
            return new this.requestScope[iName]();
          case Scope.Application:
          default:
            if (this.applicationScope[iName]) {
              throw new InvalidINameError(iName);
            }
            return this.applicationScope[iName];
        }
    }

    public getAs<T>(iName: string): T {
        if (this.applicationScope[iName] === undefined) {
            throw new Error ("Asset " + iName + " could not be aquired");
        }
        return (this.applicationScope[iName] as T);
    } 

}

export const container = new Container();

export function ApplicationScope(iName?: string) {
    return function(target: any) {
        iName = iName || target.name;
        iName = iName || "";
        container.set(iName, new target());
    }
}

// export function SessionScope(iName?: string){
//     return function(target: any) {
//         container.set()
//     }
// }
export function RequestScope(iName?: string){
    return function(target: any) {
        iName = iName || target.name;
        iName = iName || "";
        container.set(iName, target, Scope.Request);
    }
}

class Spring {
    public app: express.Application = express();
    private main: ISpringApplication | undefined; // call this configuration instead
    public container: {[key: string]: any} = {};
    public constructor() {}
    public setApplication(obj: ISpringApplication) {
        this.main = obj;
        const port = this.main ? this.main.port : 8080;
        this.app.use(bodyParser.json());
        if(this.main && this.main.session){
            this.app.use(session(this.main.session));
        }
        this.app.listen(port, function() {
            console.log("Application started on port: " + port);
        });
    }
    public getApplication(): ISpringApplication | undefined {
        return this.main;
    }
}

export const springContainer = new Spring();

export function Application(target: any) {
    springContainer.setApplication(new target());
}

export function Controller(target: any) {
}

export function Request(
         method: RequestMethod,
         route: string
       ) {
        return function (target: any, name: string, pd: PropertyDescriptor) {
           const app = springContainer.app;
           if (app !== undefined) {
             console.log("registered " + route);
             app[method](route, target[name]);
           }
       }
    }

export function Get(route: string) {
    return Request(RequestMethod.Get, route);
}

export function Post(route: string) {
  return Request(RequestMethod.Post, route);
}

export interface ISpringApplication {
    port: number;
    ssl?: {[key: string] : string};
    session?: any;
}

export function use(target: any) {
  const test = new target();
  console.log(test);
}