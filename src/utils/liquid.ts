import { Liquid } from "liquidjs";
import { pickFilter } from "./pick-filter";
import { uniqueFilter } from "./unique-filter";
import { maskIpFilter } from "./mask-ip-filter";

const engine = new Liquid();
engine.registerFilter("pick", pickFilter);
engine.registerFilter("unique", uniqueFilter);
engine.registerFilter("maskIp", maskIpFilter);

export { engine };
