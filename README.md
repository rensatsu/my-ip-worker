# My IP Cloudflare Worker

## Developing

[`src/index.js`](./src/index.ts) calls the request handler in [`src/handler.ts`](./src/handler.ts), and will return the [request method][mdn-request] for the given request.

## Formatting

This template uses [`prettier`][prettier] to format the project. To invoke, run `npm run format`.

## Previewing and Publishing

For information on how to preview and publish your worker, please see the [Wrangler docs][wrangler-publish].


[mdn-request]: https://developer.mozilla.org/en-US/docs/Web/API/Request/method
[prettier]: https://prettier.io/
[wrangler-publish]: https://developers.cloudflare.com/workers/tooling/wrangler/commands/#publish
