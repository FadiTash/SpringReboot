import {Controller, Get, Post} from "../ExpressAnnotations";

@Controller
export default class MyController {
  @Get("/hello")
  go(req: any) {
    return {
        view:"hello",
        param: {name: "Fadi"}
    };
  }

  @Post("/audi")
  go1(req: any) {
    return JSON.stringify({
        view:"hello",
        param: {name: "Fadi"}
    });
  }
}
