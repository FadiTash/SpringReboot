import {use} from "./ExpressAnnotations";
import {MyApplication} from "./config";
import {Akilasan} from "./controllers/akila";
import Gregg from "./controllers/gregg";


use(MyApplication);
use(Akilasan);
use(Gregg);