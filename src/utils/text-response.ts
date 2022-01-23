import { Infodata } from "../structs/info-data";

/**
 * Create plain text response.
 *
 * @param {Infodata} data
 * @returns {Response} User info data.
 */
function textResponse(data: Infodata): Response {
  return new Response(`${data.ip}\n`, {
    status: 200,
    headers: {
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "content-type": "text/plain; charset=utf-8",
    },
  });
}

export default textResponse;
