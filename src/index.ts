import {Application, IExpressApplication, Controller, Get, Post} from "./ExpressAnnotations";
import express = require("express");

@Application
 class MyApplication implements IExpressApplication {
     public port = 8100;
     public session = {
        secret: 'reboot',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    };
}

@Controller
class MyController {
  @Get("/hello")
  go(req: express.Request) {
    return {
        view:"hello",
        param: {name: "Fadi"}
    };
  }

  @Get("/audi")
  go1(req: any) {
    return "audi";
  }
  // res.render("view name", object)
}
