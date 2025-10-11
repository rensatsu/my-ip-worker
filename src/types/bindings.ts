import type { KVNamespace } from "@cloudflare/workers-types";

export interface Bindings {
  ASNCACHE: KVNamespace;
  TEXT_API_ENABLED?: string;
}
