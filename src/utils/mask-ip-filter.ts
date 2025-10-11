import { randomString } from "./random-string";

/**
 * LiquidJS filter to mask IP address (if required).
 *
 * @param {string} ip IP address
 * @param {boolean} allowTextApi Should we reveal the address.
 */
function maskIpFilter(ip: string, allowTextApi: boolean) {
  if (allowTextApi) return ip;

  const ipParts = [...ip].map((e) => {
    const rnd = randomString(5);
    return `${e}<!--${rnd}-->`;
  });

  return ipParts.join("");
}

export { maskIpFilter };
