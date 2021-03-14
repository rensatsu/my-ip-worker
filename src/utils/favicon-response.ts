import faviconSvg from "../assets/favicon.svg";

/**
 * Create favicon response.
 *
 * @returns {Promise<Response>} (async for compatibility)
 */
async function faviconResponse(): Promise<Response> {
  return new Response(faviconSvg, {
    status: 200,
    headers: {
      "cache-control": "max-age=600",
      "content-type": "image/svg+xml",
    },
  });
}

export default faviconResponse;
