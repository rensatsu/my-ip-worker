import errorResponse from "./utils/error-response";
import fetchAsnData from "./utils/fetch-asn";
import { Infodata } from "./structs/info-data";
import ResponseType from "./structs/response-type";
import textResponse from "./utils/text-response";
import jsonResponse from "./utils/json-response";
import htmlResponse from "./utils/html-response";
import faviconResponse from "./utils/favicon-response";
import { StatusCodes } from "http-status-codes";
import textAgents from "./utils/text-agents";

/**
 * Collect user info data
 * @param {Request} request Incoming request
 */
async function getData(request: Request) {
  const asn = request.cf?.asn ?? null;
  let isp = null;

  if (asn) {
    try {
      const asnData = await fetchAsnData(asn);
      isp = `${asnData.description} (${asnData.name})`;
    } catch (e) {
      console.warn("ASN Data fetch failed", e.message, e);
    }
  }

  const infoData = new Infodata({
    ip: request.headers?.get("cf-connecting-ip"),
    countryCode: request.headers?.get("cf-ipcountry"),
    asn: asn,
    isp: isp,
    userAgent: request.headers?.get("user-agent"),
  });

  return infoData;
}

/**
 * Detect data request type
 * @param {Request} request Incoming request
 */
function detectType(request: Request) {
  const hAccept = request.headers?.get("accept") ?? "";

  // Return JSON if requested JSON.
  if (hAccept.includes("json")) {
    return ResponseType.JSON;
  }

  // Return text if requested text-only.
  if (hAccept.includes("plain")) {
    return ResponseType.TEXT;
  }

  // Return plain text for CLI tools.
  const userAgent = (request.headers?.get("user-agent") || "").toLowerCase();
  if (textAgents.filter((e) => userAgent.includes(e)).length > 0) {
    return ResponseType.TEXT;
  }

  // Return HTML otherwise.
  return ResponseType.HTML;
}

/**
 * Handle IP data request
 * @param {Request} request Incoming request
 * @param {ResponseType} forceType Force response type
 */
async function handleIpData(request: Request, forceType: ResponseType = ResponseType.HTML) {
  const data = await getData(request);
  const type = forceType ?? detectType(request);

  switch (type) {
    case ResponseType.TEXT:
      return textResponse(data);
    case ResponseType.JSON:
      return jsonResponse(data);
    case ResponseType.HTML:
    default:
      return await htmlResponse(data);
  }
}

/**
 * Respond to the request
 * @param {Request} request Incoming request
 */
async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const method = request.method.toLowerCase();

  if (method !== "get") {
    return errorResponse("Bad request", StatusCodes.BAD_REQUEST);
  }

  switch (url.pathname) {
    case "/favicon.ico":
      return await faviconResponse();
    case "/ip":
      return await handleIpData(request, ResponseType.TEXT);
    case "/json":
      return await handleIpData(request, ResponseType.JSON);
    case "/":
      return await handleIpData(request);
    default:
      return errorResponse("Not found", StatusCodes.NOT_FOUND);
  }
}

export { handleRequest };
