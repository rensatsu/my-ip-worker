import { StatusCodes } from "http-status-codes";

/**
 * Create error response.
 *
 * @param {string} message Error message.
 * @param {number} [status=StatusCodes.INTERNAL_SERVER_ERROR] HTTP Status code.
 * @returns {Response}
 */
function errorResponse(
  message: string,
  status: number = StatusCodes.INTERNAL_SERVER_ERROR,
): Response {
  return new Response(message, {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "text/plain; charset=utf-8",
    },
  });
}

export default errorResponse;
