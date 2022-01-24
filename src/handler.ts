declare const TEXT_API_ENABLED: string;
declare const ASNCACHE: KVNamespace;

import errorResponse from "./utils/error-response";
import { Infodata } from "./structs/info-data";
import ResponseType from "./structs/response-type";
import textResponse from "./utils/text-response";
import jsonResponse from "./utils/json-response";
import htmlResponse from "./utils/html-response";
import { StatusCodes } from "http-status-codes";
import textAgents from "./utils/text-agents";
import staticRouter from "./utils/static-router";
import ms from "ms";

/**
 * Collect user info data
 * @param {Request} request Incoming request
 */
async function getData(request: Request): Promise<Infodata> {
  const asn = request.cf?.asn ?? null;
  const isp = request.cf?.asOrganization ?? null;

  const infoData = new Infodata({
    ip: request.headers?.get("cf-connecting-ip"),
    countryCode: request.cf?.country ?? null,
    region: request.cf?.region ?? null,
    city: request.cf?.city ?? null,
    asn: asn,
    isp: isp,
    userAgent: request.headers?.get("user-agent"),
  });

  if (asn !== null && isp !== null) {
    await ASNCACHE.put(
      `as${asn}`,
      JSON.stringify({ name: null, description: isp }),
      {
        expirationTtl: ms("1y") / 1000,
      },
    );
  }

  return infoData;
}

/**
 * Detect data request type
 * @param {Request} request Incoming request
 */
function detectType(request: Request): ResponseType {
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
 * Check if API is enabled and determine data request type
 * @param {Request} request Incoming request
 */
function checkType(
  request: Request,
  forceType: ResponseType | null = null,
): ResponseType {
  if (TEXT_API_ENABLED !== "1") return ResponseType.HTML;
  return forceType ?? detectType(request);
}

/**
 * Handle IP data request
 * @param {Request} request Incoming request
 * @param {ResponseType} forceType Force response type
 */
async function handleIpData(
  request: Request,
  forceType: ResponseType | null = null,
): Promise<Response> {
  const data = await getData(request);
  const type = checkType(request, forceType);

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
    case "/assets/style.css":
    case "/assets/apple-touch-icon.png":
      return staticRouter(url.pathname);
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
