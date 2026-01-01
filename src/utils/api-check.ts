import type { Bindings } from "../types/bindings";

function canUseApi(env?: Bindings): boolean {
  return env?.TEXT_API_ENABLED === "1";
}

export { canUseApi };
