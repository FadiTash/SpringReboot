import {Application, ISpringApplication, Controller, Get, use} from "./container";
import express = require("express");
import {Tester} from "./test";



@Application
class MyApplication implements ISpringApplication {
    public port = 8100;
}


@Controller
class MyController {
    @Get("/hello")
    static go(req: any, res: any) {
        res.send("Hello");
    }
}

use (Tester);