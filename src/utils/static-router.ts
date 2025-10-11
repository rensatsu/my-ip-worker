import { Hono } from "hono";
import ms from "ms";
import { StatusCodes } from "http-status-codes";
import assetStyle from "../assets/style.css";
import assetFavicon from "../assets/favicon.svg";
import assetGithubIcon from "../assets/icons/github.svg";
import assetTouchIcon from "../assets/apple-touch-icon.png";
import errorResponse from "./error-response";
import type { Bindings } from "../types/bindings";

type StaticAsset = {
  body: BodyInit;
  contentType: string;
};

const cacheSeconds = ms("14d") / 1000;

const baseHeaders = {
  "cache-control": `max-age=${cacheSeconds}`,
  "x-content-type-options": "nosniff",
} as const;

const staticAssets: Record<string, StaticAsset> = {
  "/favicon.ico": {
    body: assetFavicon,
    contentType: "image/svg+xml",
  },
  "/assets/style.css": {
    body: assetStyle,
    contentType: "text/css",
  },
  "/assets/apple-touch-icon.png": {
    body: assetTouchIcon,
    contentType: "image/png",
  },
  "/assets/icons/github.svg": {
    body: assetGithubIcon,
    contentType: "image/svg+xml",
  },
};

const staticRouter = new Hono<{ Bindings: Bindings }>();

Object.entries(staticAssets).forEach(([path, asset]) => {
  staticRouter.get(path, () => {
    return new Response(asset.body, {
      status: StatusCodes.OK,
      headers: {
        ...baseHeaders,
        "content-type": asset.contentType,
      },
    });
  });
});

staticRouter.notFound(() =>
  errorResponse("Not found", StatusCodes.NOT_FOUND),
);

export default staticRouter;
