// const { merge } = require("webpack-merge");
// const common = require("./webpack.common.js");
// const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

// process.env["NODE_ENV"] = "production";

// module.exports = merge([
//   common,
//   {
//     mode: "production",
//     optimization: {
//       minimize: true,
//       minimizer: [
//         // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
//         // `...`,
//         new CssMinimizerPlugin(),
//       ],
//     },
//   },
// ]);


const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    main: "./src/index.js", // renamed entry point to "main"
  },
output: {
  filename: "app.js",
  path: path.resolve(__dirname, "dist"),
},

plugins: [
  new MiniCssExtractPlugin({
    filename: "app.css",
  }),
],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
};