import express = require("express"); 

class Container {
    public content: {[key: string]: any} = {};
    public constructor() {

    }

    public set(iName: string, Ob: any) {
        if (this.content[iName]) {
            throw new Error("This item " + iName + " already exists as an Application scoped object");
        }
        this.content[iName] = Ob;        
    }

    public get(iName: string): any {
        if (this.content[iName] === undefined) {
            throw new Error ("Asset " + iName + " could not be aquired");
        }
        return this.content[iName];
    }

    public getAs<T>(iName: string): T {
        if (this.content[iName] === undefined) {
            throw new Error ("Asset " + iName + " could not be aquired");
        }
        return (this.content[iName] as T);
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

class Spring {
    public app: express.Application = express();
    private main: ISpringApplication | undefined; // call this configuration instead
    public container: {[key: string]: any} = {};
    public constructor() {}
    public setApplication(obj: ISpringApplication) {
        this.main = obj;
        const port = this.main ? this.main.port : 8080;
        this.app.listen(port, function() {
            console.log("Application started on port: " + port);
        });
    }
    public getApplication(): ISpringApplication | undefined {
        return this.main;
    }
}

enum RequestMethod {
    Get = 'get',
    Post = 'post',
    Delete = 'delete',
    Put = 'put'
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
    ssl?: {[key: string] : string}
}

export function use(target: any) {
  const test = new target();
  console.log(test);
}