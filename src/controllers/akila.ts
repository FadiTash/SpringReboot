import {Get, Controller} from "../ExpressAnnotations";
@Controller
export class Akilasan {
    @Get("/lol")
    go2() {
        return {
            view: "akila",
            param: {
                name: "akila",
                husband: "Gregg"
            }
        };
    }
}