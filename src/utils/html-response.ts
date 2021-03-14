import { Infodata } from "../structs/info-data";
import dayjs from "dayjs";
import templateBuffer from "../assets/template.liquid";
import styleBuffer from "../assets/style.css";
import ab2str from "arraybuffer-to-string";
import cryptoRandomString from "crypto-random-string";
import { StatusCodes } from "http-status-codes";
import { Liquid } from "liquidjs";

/**
 * Create HTML response.
 *
 * @param {Infodata} data User info data.
 * @returns {Promise<Response>}
 */
async function htmlResponse(data: Infodata): Promise<Response> {
  const engine = new Liquid();

  const now = dayjs();
  const nonce = cryptoRandomString({ length: 15, type: "alphanumeric" });

  const templateSrc = ab2str(templateBuffer) as string;
  const styleSrc = ab2str(styleBuffer) as string;
  const tpl = engine.parse(templateSrc);

  const replacements = {} as Record<string, any>;

  replacements.infodata = data;
  replacements.year = now.format("YYYY");
  replacements.timestamp = now.unix().toString();
  replacements.datetime = now.toISOString();
  replacements.nonce = nonce;
  replacements.style = styleSrc;

  const body = await engine.render(tpl, replacements);

  return new Response(body, {
    status: StatusCodes.OK,
    headers: {
      "cache-control": "no-store",
      "content-type": "text/html",
      "content-security-policy": `default-src 'none'; img-src 'self'; style-src 'nonce-${nonce}'`,
    },
  });
}

export default htmlResponse;
