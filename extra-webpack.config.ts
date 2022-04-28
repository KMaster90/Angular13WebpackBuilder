import { Configuration, DefinePlugin } from 'webpack';
import { version } from '@project';
import HtmlWebpackPlugin from "html-webpack-plugin";

/**
 * This is where you define your additional webpack configuration items to be appended to
 * the end of the webpack config.
 */
export default {
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'footer.html',
      template: 'src/footer.template.html',
    }),
    new DefinePlugin({
      APP_VERSION: JSON.stringify(version),
    }),
  ],
} as Configuration;
