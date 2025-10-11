import type { ExecutionContext } from "@cloudflare/workers-types";
import type { Bindings } from "./types/bindings";
import app from "./handler";

export default {
  fetch(request: Request, env: Bindings, ctx: ExecutionContext) {
    return app.fetch(request, env, ctx);
  },
};
