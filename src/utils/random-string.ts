import ab2str from "arraybuffer-to-string";

function randomString(numBytes: number): string {
  const rnd = new Uint32Array(numBytes);
  crypto.getRandomValues(rnd);
  return ab2str(rnd, "hex");
}

export { randomString };
