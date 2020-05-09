import {use} from "./lib/ExpressAnnotations";
import {MyApplication} from "./config";
import home from "./controllers";


use(MyApplication);
use(home);