import fs from 'fs';
import path from 'path';
import { Configuration } from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { version } from './package.json';
import ManifestV3 = chrome.runtime.ManifestV3;

const extensions = ['.ts', '.tsx', '.js', '.jsx'];
const ICONS_DIR = './src/icon';

export default {
  stats: {
    errorDetails: true,
  },
  entry: {
    background: './src/chrome/background/background.ts',

    options: './src/react/options/options.tsx',
    popup: './src/react/popup/popup.tsx',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    // Generate popup HTML file
    new HtmlWebpackPlugin({
      template: 'src/react/popup/popup.html',
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    // Generate options HTML file
    new HtmlWebpackPlugin({
      template: 'src/react/options/options.html',
      filename: 'options.html',
      chunks: ['options'],
    }),
    // Copy static files (manifest.json, icons, etc.)
    new CopyPlugin({
      patterns: [
        {
          from: './src/chrome/manifest.json',
          to: 'manifest.json',
          transform: content => {
            /* PARSE */
            const strContent = content
              .toString()
              // regex: matches any comment (with `//` or `/* */`) that is not inside a string
              .replace(/(?=(?:[^"]*"[^"]*")*[^"]*$)(\/\*.*?\*\/|\/\/.*$)/gm, '');
            const manifest = JSON.parse(strContent) as ManifestV3;

            /* UPDATE */
            const icons: [string, string][] = fs.readdirSync(ICONS_DIR)
              .map(icon => {
                const match = /icon-(\d+).png/.exec(icon);
                if (!match) return null;
                return [match[1], `icon/${icon}`];
              })
              .filter(Boolean) as [string, string][];
            manifest.icons = { ...manifest.icons, ...Object.fromEntries(icons) };
            manifest.version = version;

            return JSON.stringify(manifest, null, 2);
          },
        },
        {
          from: ICONS_DIR,
          to: 'icon',
        },
      ],
    }),
    new MiniCssExtractPlugin(),
    new CssMinimizerPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.[jt]sx?/i,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions,
    plugins: [
      new TsconfigPathsPlugin({
        extensions,
      }),
    ],
  },
} as Configuration;
