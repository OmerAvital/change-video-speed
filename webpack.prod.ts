import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import common from './webpack.common';

export default merge<Configuration>(common, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      '...',
      new MiniCssExtractPlugin(),
    ],
  },
} as Configuration);
