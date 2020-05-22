const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

"use strict";
{
  const distFolder = require('path').resolve(__dirname, "dist");
  module.exports = {
    mode: "development",
    
    watchOptions: {
      ignored: /node_modules/
    },
    
    entry: {
      index: "./src/index.ts",
      about: "./src/about.ts",
      contact: "./src/contact.ts"
    },
    output: {
      filename: '[name].[hash].js',
      path: distFolder
    },
    devServer: {
      host: "localhost",
      port: 3000,
      open: true
    },
    module: {
      rules: [
        {
          test: /\.(s*)css$/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            { loader: 'css-loader' },
            { loader: 'postcss-loader' },
            { loader: 'sass-loader' }
          ]
        }
      ],
    },
    plugins: [
      createHtmlWebpackPluginFor('index'),
      createHtmlWebpackPluginFor('about'),
      createHtmlWebpackPluginFor('contact'),
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: `styles.[hash].css`
      })
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