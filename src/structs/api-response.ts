import { StatusCodes } from "http-status-codes";

/**
 * Wrapper for Response to serve formatted JSON.
 *
 * @class ApiResponse
 * @extends {Response}
 */
class ApiResponse extends Response {
  /**
   * Creates an instance of ApiResponse.
   * @param {*} [body] JSON serializable body
   * @param {(ResponseInit | undefined)} [init] Init options
   * @memberof ApiResponse
   */
  constructor(body?: any, init?: ResponseInit | undefined) {
    const headers = {
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "content-type": "application/json",
    };

    const modInit = {
      ...{ status: StatusCodes.OK },
      ...init,
      ...headers,
    } as ResponseInit;

    super(JSON.stringify(body, null, 2), modInit);
  }
}

export default ApiResponse;
