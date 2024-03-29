declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.liquid" {
  const content: string;
  export default content;
}

declare module "*.css" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: Uint8Array;
  export default content;
}
