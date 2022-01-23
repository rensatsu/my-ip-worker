import assetStyle from "../assets/style.css";
import assetFavicon from "../assets/favicon.svg";
import assetTouchIcon from "../assets/apple-touch-icon.png";
import errorResponse from "./error-response";
import ms from "ms";

/**
 * Create file response object.
 *
 * @param {ArrayBuffer} file File's ArrayBuffer.
 * @param {string} mime MIME type.
 * @param {number} [status=200] HTTP Status
 * @returns {Response}
 */
function fileResponse(file: ArrayBuffer, mime: string, status: number = 200): Response {
  return new Response(file, {
    status: status,
    headers: {
      "cache-control": `max-age=${ms("14d") / 1000}`,
      "content-type": mime,
      "x-content-type-options": "nosniff",
    },
  });
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
      return fileResponse(assetTouchIcon, "image/png");
    default:
      return errorResponse("Not found", 404);
  }
}

export default staticRouter;
