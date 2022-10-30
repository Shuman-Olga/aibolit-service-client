const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const Dotenv = require('dotenv-webpack');

let mode = 'development';
if (process.env.NODE_ENV === 'production') {
  mode = 'production';
}
module.exports = {
  mode,
  entry: './src/index.js',
  devtool: 'source-map',
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[hash][ext][query]',
    clean: true,
    filename: 'bundle.js',
  },
  resolve: {
    // alias: {
    //   components: path.resolve(__dirname, 'src'),
    // },
    extensions: ['.js', '.jsx'],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico',
      manifest: './public/manifest.json',
      filename: 'index.html',
    }),

    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),

    new webpack.ProvidePlugin({
      React: 'react',
    }),

    new Dotenv({
      path: './.env',
    }),
  ],
  devServer: {
    port: 8081,
    hot: true,
    open: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      { test: /\.(html)$/, use: ['html-loader'] },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.m?jsx?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
        type: mode === 'production' ? 'asset' : 'asset/resource',
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
