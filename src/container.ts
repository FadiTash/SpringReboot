import express = require("express"); 
export const container: {[key: string]: any} = {

};

export function bean (target: any) {
    var original = target;
  
    var f : any = function (...args: any[]) {
      let x = new original(args);
      container[target.name] = x;
      return x;
    }
   
    f.prototype = original.prototype;
    return f;
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

export const springContainer = new Spring();

export function Application(target: any) {
    springContainer.setApplication(new target());
}

export function Controller(target: any) {
}

export function Get(route: string) {
    return function (target: any, name: string, pd: PropertyDescriptor) {
        const app = springContainer.app;
        if (app !== undefined) {
            console.log("registered " + route);
            app.get(route, target[name]);
        }
    }
}

export function Post(route: string) {
  return function (target: any, name: string, pd: PropertyDescriptor) {
      const app = springContainer.app;
      if (app !== undefined) {
          console.log("registered " + route);
          app.post(route, target[name]);
      }
  }
}

export interface ISpringApplication {
    port: number;
}

export function use(target: any) {
  const test = new target();
  console.log(test);
}