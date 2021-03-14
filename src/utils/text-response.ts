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
      "content-type": "text/plain",
    },
  });
}

export default textResponse;
