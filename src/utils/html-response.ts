import { Infodata } from "../structs/info-data";
import dayjs from "dayjs";
import templateContents from "../assets/template.liquid";
import { StatusCodes } from "http-status-codes";
import { Liquid } from "liquidjs";
import { pickFilter } from "./pick-filter";
import { uniqueFilter } from "./unique-filter";
import { randomString } from "./random-string";
import { canUseApi } from "./api-check";

function maskIp(ip: string) {
  if (canUseApi()) return ip;

  const ipParts = [...ip].map((e) => {
    const rnd = randomString(5);
    return `${e}<!--${rnd}-->`;
  });

  return ipParts.join("");
}

/**
 * Create HTML response.
 *
 * @param {Infodata} data User info data.
 * @returns {Promise<Response>}
 */
async function htmlResponse(data: Infodata): Promise<Response> {
  const engine = new Liquid();
  engine.registerFilter("pick", pickFilter);
  engine.registerFilter("unique", uniqueFilter);

  const now = dayjs();

  const tpl = engine.parse(templateContents);

  const replacements = {} as Record<string, any>;

  replacements.infodata = data;
  replacements.year = now.format("YYYY");
  replacements.timestamp = now.unix().toString();
  replacements.datetime = now.toISOString();
  replacements.ipDisplay = maskIp(data.ip ?? "");
  replacements.commithash = COMMITHASH;
  replacements.version = VERSION;

  const body = await engine.render(tpl, replacements);

  return new Response(body, {
    status: StatusCodes.OK,
    headers: {
      "cache-control": "no-store",
      "content-type": "text/html; charset=utf-8",
      "x-content-type-options": "nosniff",
      "content-security-policy":
        "default-src 'none'; img-src 'self'; style-src 'self'",
    },
  });
}

export default htmlResponse;
