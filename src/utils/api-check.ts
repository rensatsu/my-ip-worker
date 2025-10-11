import type { Bindings } from "../types/bindings";

function canUseApi(env?: Bindings): boolean {
  if (!env) return false;
  return typeof env.TEXT_API_ENABLED === undefined && env.TEXT_API_ENABLED !== "1";
}

export { canUseApi };
