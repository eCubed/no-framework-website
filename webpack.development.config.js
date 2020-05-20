const HtmlWebpackPlugin = require('html-webpack-plugin');

"use strict";
{
  const distFolder = require('path').resolve(__dirname, "dist");
  module.exports = {
    mode: "development",
    watch: true,
    watchOptions: {
      ignored: /node_modules/
    },
    entry: {
      index: "./src/index.js",
      about: "./src/about.js",
      contact: "./src/contact.js"
    },
    output: {
      filename: '[name].js',
      path: distFolder
    },
    devServer: {
      host: "localhost",
      port: 3000,
      open: true
    },
    plugins: [
      createHtmlWebpackPluginFor('index'),
      createHtmlWebpackPluginFor('about'),
      createHtmlWebpackPluginFor('contact')
    ]
  };
}

function createHtmlWebpackPluginFor(pageName) {
  return new HtmlWebpackPlugin({
    template: `./src/${pageName}.html`,
    filename: `${pageName}.html`,
    inject: "body",
    chunks: [`${pageName}`]
  });
}