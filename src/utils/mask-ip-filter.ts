import { randomString } from "./random-string";
import { canUseApi } from "./api-check";

/**
 * LiquidJS filter to mask IP address (if required).
 *
 * @param {string} ip IP address
 */
function maskIpFilter(ip: string) {
  if (canUseApi()) return ip;

  const ipParts = [...ip].map((e) => {
    const rnd = randomString(5);
    return `${e}<!--${rnd}-->`;
  });

  return ipParts.join("");
}

export { maskIpFilter };
