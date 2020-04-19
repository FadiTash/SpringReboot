import {Application, ISpringApplication, Controller, Get, use, Post, container, ApplicationScope} from "./container";
// import express = require("express");
// import {Tester} from "./test";



// @Application
// class MyApplication implements ISpringApplication {
//     public port = 8100;
// }


// @Controller
// class MyController {
//     @Post("/hello")
//     static go(req: any, res: any) {
//         res.send("Hello");
//     }
// }

// use (Tester);


@ApplicationScope()
class Man {
    public name: string = "Hi there";
}


function SessionScope(iName?: string) {
    return function(target: any) {
        iName = iName || target.name;
        iName = iName || "";
        container.set(iName, new target());
    }
}



const r = container.getAs<Man>("Man");
