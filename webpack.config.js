const path = require("path");
const webpack = require("webpack");
const mode = process.env.NODE_ENV || "production";

console.log("Webpack version", webpack.version);

module.exports = function () {
  const cfg = {
    target: "webworker",
    output: {
      filename: `worker.${mode}.js`,
      path: path.join(__dirname, "dist"),
    },
    mode,
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      plugins: [],
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
          use: [
            {
              loader: "arraybuffer-loader",
            },
            {
              loader: "svgo-loader",
            },
          ],
        },
        {
          test: /\.(html|liquid|css|png)?$/,
          use: [
            {
              loader: "arraybuffer-loader",
            },
          ],
        },
      ],
    },
  };

  if (mode !== "production") {
    cfg.devtool = "inline-source-map";
  }

  return cfg;
};
