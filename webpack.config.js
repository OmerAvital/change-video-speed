const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = env => {
  const { production } = env;

  return {
    mode: production ? 'production' : 'development',
    devtool: production ? 'source-map' : 'inline-cheap-source-map',
    stats: {
      errorDetails: true,
    },
    entry: {
      background: './src/background.ts',

      options: './src/options/options.ts',
      popup: './src/popup/popup.ts',
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      assetModuleFilename: 'assets/[name][ext][query]',
    },
    plugins: [
      // Copy static files (manifest.json, icons, etc.)
      new CopyWebpackPlugin({
        patterns: [
          {
            from: './src/manifest.json',
            to: 'manifest.json',
            transform: (content, path) => {
              const manifest = JSON.parse(content);
              /* transform manifest here */
              return JSON.stringify(manifest, null, 2);
            },
          },
          {
            from: './src/icon',
            to: 'icon',
          },
        ],
      }),
      // Generate popup HTML file (inserts the js and css files into the HTML)
      new HtmlWebpackPlugin({
        template: './src/popup/popup.html',
        filename: 'popup.html',
        chunks: ['popup'],
      }),
      // Generate options HTML file (inserts the js and css files into the HTML)
      new HtmlWebpackPlugin({
        template: './src/options/options.html',
        filename: 'options.html',
        chunks: ['options'],
      }),
      // Creates and copies the css files. Remove if you want to inject the css into the HTML head.
      new MiniCssExtractPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader, // Change this to 'style-loader' to inject CSS into the HTML head.
            'css-loader',
            'sass-loader',
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [
        new CssMinimizerPlugin(),
        new TerserPlugin(),
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
  };
};
