const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = env => {
  const { production } = env;

  return {
    mode: production ? 'production' : 'development',
    devtool: production ? 'source-map' : 'inline-cheap-source-map',
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
      new CopyWebpackPlugin({
        patterns: [
          {
            from: './src/chrome/manifest.json',
            to: 'manifest.json',
            transform: content => {
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
    ],
    module: {
      rules: [
        {
          test: /\.tsx?/i,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.css/i,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
          ],
        },
      ],
    },
    optimization: {

    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        components: path.resolve(__dirname, 'src', 'chrome', 'components'),
      },
    },
  };
};
