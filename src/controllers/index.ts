import {Controller, Get, Post} from "../lib/ExpressAnnotations";

@Controller("/kwala")
export default class MyController {
  @Get("/")
  go(req: any) {
    return {
        view:"index",
        param: {name: " world"}
    };
  }
}
