# My IP Cloudflare Worker

Cloudflare Worker which shows your IP and some details about your ISP.

## Environment variables

- `TEXT_API_ENABLED` - Set to `1` to allow text mode (return only an IP).

## Formatting

This project uses [`prettier`][prettier] to format the project. To invoke, run `npm run format`.

## Previewing and Publishing

For information on how to preview and publish your worker, please see the [Wrangler docs][wrangler-publish].

[prettier]: https://prettier.io/
[wrangler-publish]: https://developers.cloudflare.com/workers/tooling/wrangler/commands/#publish
