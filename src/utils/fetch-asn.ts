declare const ASNCACHE: KVNamespace;

import Asn from "../structs/asn-data";
import ms from "ms";

async function getIspName(asn: number | null): Promise<string | null> {
  if (asn === null) return null;

  const asnData = await fetchAsnData(asn).catch((e) => {
    console.warn("Unable to fetch ASN data", { asn, e });
  });

  if (!asnData) return null;

  // Return either name or description if only one of the fields is available
  if (asnData.description === "" || asnData.name === "") {
    return [asnData.name, asnData.description].filter((e) => !!e).at(0) ?? null;
  }

  // Return only description if both name and description are the same
  if (asnData.name.toLowerCase() === asnData.description.toLowerCase()) {
    return asnData.description;
  }

  // Return both name and description otherwise
  return `${asnData.description} (${asnData.name})`;
}

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

  const json = (await response.json()) as any;
  if (json?.status !== "ok") {
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

export { getIspName, fetchAsnData };
