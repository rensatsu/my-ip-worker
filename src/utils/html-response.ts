import { Infodata } from "../structs/info-data";
import templateContents from "../assets/template.liquid";
import { StatusCodes } from "http-status-codes";
import { engine } from "./liquid";

/**
 * Create HTML response.
 *
 * @param {Infodata} data User info data.
 * @returns {Promise<Response>}
 */
async function htmlResponse(data: Infodata): Promise<Response> {
  const tpl = engine.parse(templateContents);

  const replacements = {} as Record<string, any>;

  replacements.infodata = data.toJson();
  replacements.timestamp = new Date();

  const body = await engine.render(tpl, replacements);

  return new Response(body, {
    status: StatusCodes.OK,
    headers: {
      "cache-control": "no-store",
      "content-type": "text/html; charset=utf-8",
      "x-content-type-options": "nosniff",
      "content-security-policy":
        "default-src 'none'; img-src 'self' https://rensatsu.com; style-src 'self'",
    },
  });
}

export default htmlResponse;
