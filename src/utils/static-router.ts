import assetStyle from "../assets/style.css";
import assetFavicon from "../assets/favicon.svg";
import assetTouchIcon from "../assets/apple-touch-icon.png";
import errorResponse from "./error-response";
import ms from "ms";
import { StatusCodes } from "http-status-codes";

/**
 * Create file response object.
 *
 * @param {ArrayBuffer} file File's ArrayBuffer.
 * @param {string} mime MIME type.
 * @param {number} [status=StatusCodes.OK] HTTP Status
 * @returns {Response}
 */
function fileResponse(
  file: BodyInit,
  mime: string,
  status: number = StatusCodes.OK,
): Response {
  return new Response(file, {
    status: status,
    headers: {
      "cache-control": `max-age=${ms("14d") / 1000}`,
      "content-type": mime,
      "x-content-type-options": "nosniff",
    },
  });
}

function jsonBufferResponse(
  file: Uint8Array,
  mime: string,
  status: number = StatusCodes.OK,
): Response {
  return fileResponse(file.buffer, mime, status);
}

/**
 * Create a response object router for static files.
 *
 * @param {string} path
 * @returns {Response}
 */
function staticRouter(path: string): Response {
  switch (path) {
    case "/favicon.ico":
      return fileResponse(assetFavicon, "image/svg+xml");
    case "/assets/style.css":
      return fileResponse(assetStyle, "text/css");
    case "/assets/apple-touch-icon.png":
      return jsonBufferResponse(assetTouchIcon, "image/png");
    default:
      return errorResponse("Not found", 404);
  }
}

export default staticRouter;
