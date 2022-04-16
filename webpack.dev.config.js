const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",

  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "",
  },

  mode: "development",

  devtool: "source-map",

  plugins: [
    // new TerserPlugin(),

    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.hbs",

      title: "Bugs State Management Middleware",
      description: 'A brief decription of "Bugs State Management Middleware"',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.hbs$/,
        use: ["handlebars-loader"],
      },

      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
    ],
  },

  devServer: {
    port: 9000,
    open: true,
    static: {
      directory: path.resolve(__dirname, "./dist"),
    },

    devMiddleware: {
      index: "index.html",
      writeToDisk: true,
    },
  },
};
