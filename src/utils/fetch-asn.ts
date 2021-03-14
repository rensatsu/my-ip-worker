declare const ASNCACHE: KVNamespace;

import Asn from "../structs/asn-data";
import ms from "ms";

/**
 * Fetch ASN data from bgpview.io API.
 *
 * @param {number} asn AS number.
 * @returns {Promise<Asn>}
 */
async function fetchAsnData(asn: number): Promise<Asn> {
  const cached = (await ASNCACHE.get(`as${asn}`, "json")) as Asn;
  if (cached) {
    cached.cached = true;
    return cached;
  }

  const response = await fetch(`https://api.bgpview.io/asn/${asn}`);
  if (!response.ok) throw new Error("ASN Data Request Failed");

  const json = await response.json();
  if (!("status" in json) || json.status !== "ok") {
    throw new Error("ASN Data Request returned an error");
  }

  const data = {
    name: json.data.name,
    description: json.data.description_short,
  } as Asn;

  await ASNCACHE.put(`as${asn}`, JSON.stringify(data), {
    expirationTtl: ms("1y") / 1000,
  });

  return data;
}

export default fetchAsnData;
