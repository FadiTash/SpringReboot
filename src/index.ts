import {Application, ISpringApplication, Controller, Get, use, Post, container, ApplicationScope} from "./container";
// import express = require("express");
// import {Tester} from "./test";



@Application
 class MyApplication implements ISpringApplication {
     public port = 8100;
     public session = {
        secret: 'reboot',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    };
}


// @Controller
// class MyController {
//   @Get("/hello")
//   static go(req: any, res: any) {
//     if (req.session.fadi) {
//       req.session.fadi++;
//     } else {
//       req.session.fadi = 1;
//     }
//     res.send(req.session.fadi + "");
//   }
//   @Get("/h2")
//   static go2(req: any, res: any) {
//     if (req.session.fadi) {
//       req.session.fadi++;
//     } else {
//       req.session.fadi = 1;
//     }
//     res.send(req.session.fadi + "");
//   }
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
