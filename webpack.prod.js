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
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    main: "./src/index.js", // renamed entry point to "main"
  },
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "build"),
    clean: true, // Ensures old files are removed on each build
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "app.css",
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html", // Your source HTML file
      filename: "index.html",       // Output name in build folder
      inject: true,
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
