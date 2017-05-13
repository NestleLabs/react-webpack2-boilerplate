"use strict";

const webpack = require("webpack");
const path = require("path");
const env = require("./env");
const nodeEnv = env.get('NODE_ENV'),
  PORT = env.get("PORT"),
  HOST = env.get("HOST"),
  HTTPS = env.get("HTTPS");

const publicPath = HTTPS ? `https://${HOST}:${PORT}/` : `http://${HOST}:${PORT}/`;
const dir = {
  'app': path.resolve(__dirname, "app"),
  'css': path.resolve(__dirname, "app/css"),
  'js': path.resolve(__dirname, "app/js"), 'img': path.resolve(__dirname, "app/img"),
  'node_modules': path.resolve(__dirname, "node_modules"),
  'dist': path.resolve(__dirname, "dist"),
};

const rules = [
  {
    test: /.(js|jsx)$/,
    include: [ dir.app ],
    exclude: [ dir.node_modules ],
    loader: "babel-loader",
  },
  {
    test: /.css$/,
    include: [ dir.app ],
    exclude: [ dir.node_modules ],
    use: ["style-loader", "css-loader"],
  },
  {
    test: /.html$/,
    include: [ dir.app ],
    exclude: [ dir.node_modules ],
    loader: "html-loader",
  },
  {
    test: /\.(png|gif|jpg|jpeg)$/,
    include: [ dir.app ],
    exclude: [ dir.node_modules ],
    loader: "url-loader?limit=10000&name=assets/[name]-[hash].[ext]",
  }
];

const resolve = {
  extensions: [".js", ".jsx", ".css"],
  modules: [
    "node_modules",
    dir.app,
  ],
  alias: {
    "@": dir.css,
    "#": dir.js,
  }
};

const performance = {
  hints: nodeEnv === 'production' ? "warning" : false,
  maxAssetSize: 200000,
  maxEntrypointSize: 400000,
  assetFilter (assetFilename) {
    return assetFilename.endsWith(".css") || assetFilename.endsWith(".js");
  }
};

const devServer = {
  open: true,
  contentBase: path.join(__dirname, "public"),
  compress: true,
  historyApiFallback: true,
  hot: true,
  https: HTTPS,
  noInfo: true,
  port: PORT,
  host: HOST,
  stats: {
    assets: true,
    children: false,
    chunks: false,
    hash: false,
    modules: true,
    publicPath: false,
    timings: true,
    version: false,
    warnings: true,
    colors: {
      green: '\u001b[32m]'
    },
  }
};


const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackDashboardPlugin = require("webpack-dashboard/plugin");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const plugins = [
  new HtmlWebpackPlugin({
    title: "my lowbee boileplate",
    template: `${dir.app}/template.html`,
    filename: "index.html",
  }),
  new WebpackDashboardPlugin({
    port: PORT
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(nodeEnv),
    },
  }),
];

if (nodeEnv == 'production') {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      output: {
        comments: false,
      }
    }),
    new ExtractTextWebpackPlugin('styles-[hash].css'),
    new webpack.NameModulesPlugin()
  );
} else {
  plugins.push(
    new ExtractTextWebpackPlugin("styles.css"),
    new webpack.HotModuleReplacementPlugin(),
    new WebpackDashboardPlugin()
  );
}

const output = {
  path: dir.dist,
  filename: "app-[hash].js",
  publicPath, publicPath
}

const config = {
  entry: [
    "./app",
  ],
  devtool: nodeEnv === 'development' ? "source-map" : "cheap-source-map",
  target: "web",
  output,
  resolve,
  module: {
    rules,
  },
  plugins,
  performance,
  devServer
};
module.exports = config;
