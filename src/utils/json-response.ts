import ApiResponse from "../structs/api-response";
import { Infodata } from "../structs/info-data";

/**
 * Create JSON response.
 *
 * @param {Infodata} data User info data.
 * @returns {ApiResponse}
 */
function jsonResponse(data: Infodata): ApiResponse {
  return new ApiResponse(data.toJson());
}

export default jsonResponse;
