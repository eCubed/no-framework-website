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
      chunkFilename: '[name].[hash].chunk.js',
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
          test: /styles.scss$/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            { loader: 'css-loader' },
            { loader: 'postcss-loader' },
            { loader: 'sass-loader' }
          ]
        },
        {
          test: /components.*\.scss$/,
          use: [
            { loader: 'css-loader' },
            { loader: 'postcss-loader' },
            { loader: 'sass-loader' }
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          use: [
            { loader: 'file-loader', options: { name: 'images/[name].[ext]' } },
            {
              loader: 'image-webpack-loader',
              options: {
                mozjpeg: {
                  progressive: true,
                  quality: 65
                },
                optipng: {
                  enabled: false,
                },
                pngquant: {
                  quality: [0.65, 0.90],
                  speed: 4
                },
                gifsicle: {
                  interlaced: false,
                }
              }
            }
          ]
        },
        {
          test: /\.ts$/,
          loader: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.html$/,
          loader: "html-loader"
        }
      ],
    },
    resolve: {
      extensions: ['.ts', '.js']
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