import { Hono } from "hono";
import type { IncomingRequestCfProperties } from "@cloudflare/workers-types";
import errorResponse from "./utils/error-response";
import { Infodata } from "./structs/info-data";
import ResponseType from "./structs/response-type";
import textResponse from "./utils/text-response";
import jsonResponse from "./utils/json-response";
import htmlResponse from "./utils/html-response";
import { StatusCodes } from "http-status-codes";
import textAgents from "./utils/text-agents";
import staticAssetsRouter from "./utils/static-router";
import ms from "ms";
import { UAParser } from "ua-parser-js";
import { canUseApi } from "./utils/api-check";
import type { Bindings } from "./types/bindings";

/**
 * Collect user info data
 * @param {Request} request Incoming request
 */
async function getData(request: Request, env: Bindings): Promise<Infodata> {
  const cf = request.cf as IncomingRequestCfProperties | undefined;
  const asn = cf?.asn ?? null;
  const isp = cf?.asOrganization ?? null;
  const userAgent = request.headers?.get("user-agent");

  const uaParser = new UAParser(userAgent ?? "");

  const infoData = new Infodata({
    ip: request.headers?.get("cf-connecting-ip"),
    countryCode: cf?.country ?? null,
    region: cf?.region ?? null,
    city: cf?.city ?? null,
    asn: asn,
    isp: isp,
    userAgent: userAgent,
    browser: uaParser.getBrowser(),
  });

  if (asn !== null) {
    await env.ASNCACHE.put(
      `as${asn}`,
      JSON.stringify({
        name: isp,
        country: cf?.country,
      }),
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
  env: Bindings,
  forceType: ResponseType | null = null,
): ResponseType {
  if (canUseApi(env)) return ResponseType.HTML;
  return forceType ?? detectType(request);
}

/**
 * Handle IP data request
 * @param {Request} request Incoming request
 * @param {ResponseType} forceType Force response type
 */
async function handleIpData(
  request: Request,
  env: Bindings,
  forceType: ResponseType | null = null,
): Promise<Response> {
  const data = await getData(request, env);
  const type = checkType(request, env, forceType);

  switch (type) {
    case ResponseType.TEXT:
      return textResponse(data);
    case ResponseType.JSON:
      return jsonResponse(data);
    case ResponseType.HTML:
    default:
      return await htmlResponse(data, env);
  }
}

/**
 * Hono application used by the worker runtime.
 */
const app = new Hono<{ Bindings: Bindings }>();

app.use("*", async (c, next) => {
  if (c.req.method !== "GET") {
    return errorResponse("Bad request", StatusCodes.BAD_REQUEST);
  }

  await next();
});

app.route("/", staticAssetsRouter);

app.get("/ip", (c) => handleIpData(c.req.raw, c.env, ResponseType.TEXT));

app.get("/json", (c) => handleIpData(c.req.raw, c.env, ResponseType.JSON));

app.get("/", (c) => handleIpData(c.req.raw, c.env));

app.notFound(() => errorResponse("Not found", StatusCodes.NOT_FOUND));

export default app;
