import { Controller, Get, Post } from "../lib/ExpressAnnotations";
import express from "express";

@Controller("/", (req: express.Request, resp: express.Response, next: express.NextFunction) => {
    console.log("conroller middleware");
    next();
})
export default class MyController {
    @Get("/", (req: express.Request, resp: express.Response, next: express.NextFunction) => {
        console.log("hiay from controller.get");
        next();
    })
    go(req: any) {
        return {
            view: "index",
            param: { name: " world" },
        };
    }
}
