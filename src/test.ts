import {Controller, Get} from "./container";

@Controller
export class Tester {
    @Get("/Hi")
    static go(req: any, res: any) {
        res.send("Hi");
    }

    @Get("/try")
    static ok (req: any, res: any) {
        res.send("try");
    }
}
