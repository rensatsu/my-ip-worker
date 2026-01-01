function randomString(numBytes: number): string {
  const rnd = crypto.getRandomValues(new Uint8Array(numBytes));
  return Array.from(rnd)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export { randomString };
