const path = require("path");
const webpack = require("webpack");
const mode = process.env.NODE_ENV || "production";
const { GitRevisionPlugin } = require("git-revision-webpack-plugin");
const gitRevisionPlugin = new GitRevisionPlugin();

console.log("Webpack version", webpack.version);

module.exports = function () {
  const cfg = {
    target: "webworker",
    output: {
      filename: `worker.js`,
      path: path.join(__dirname, "dist"),
    },
    mode,
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      plugins: [],
    },
    performance: {
      maxAssetSize: 800 * 1024,
      maxEntrypointSize: 800 * 1024,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
        {
          test: /\.svg$/,
          type: "asset/source",
          use: [
            {
              loader: "svgo-loader",
            },
          ],
        },
        {
          test: /\.liquid$/,
          type: "asset/source",
        },
        {
          test: /\.css$/,
          type: "asset/source",
        },
        {
          test: /\.png$/,
          type: "asset/inline",
          generator: {
            /** @param {Buffer} content */
            dataUrl(content) {
              return JSON.stringify([...new Uint8Array(content)]);
            },
          },
        },
      ],
    },
    plugins: [
      gitRevisionPlugin,
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(gitRevisionPlugin.version()),
        COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
      }),
    ],
  };

  if (mode !== "production") {
    cfg.devtool = "inline-source-map";
  }

  return cfg;
};
