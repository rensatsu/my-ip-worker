declare module "arraybuffer-to-string" {
  function _exports(
    buffer: ArrayBuffer | SharedArrayBuffer,
    encoding?: string | null,
  ): string;
  export = _exports;
}
