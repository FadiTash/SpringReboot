import {use} from "./lib/ExpressAnnotations";
import {MyApplication} from "./config";
import home from "./controllers/index";


use(MyApplication);
use(home);