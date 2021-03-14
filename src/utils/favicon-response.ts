import faviconSvg from "../assets/favicon.svg";

/**
 * Create favicon response.
 *
 * @returns {Promise<Response>}
 */
function faviconResponse(): Response {
  return new Response(faviconSvg, {
    status: 200,
    headers: {
      "cache-control": "max-age=600",
      "content-type": "image/svg+xml",
    },
  });
}

export default faviconResponse;
