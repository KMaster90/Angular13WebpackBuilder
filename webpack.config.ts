import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {AngularWebpackPlugin} from '@ngtools/webpack';
import MiniCssExtractPlugin from "mini-css-extract-plugin"

const rootDir = path.resolve(__dirname);
const outputDir = rootDir + "/distW";

export default () => ({
  devServer: {
    compress: true,
    historyApiFallback: true,
    port: 4200,
  },
  entry: {
    polyfills: {import: "./src/polyfills.ts"},
    main: {import: ["./src/main.ts", "./src/environments/environment.ts"]},
    styles: "./src/styles.css",
  },
  target: ['web', 'es2015'],
  devtool: 'eval-source-map',
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".mjs"]
  },
  output: {
    filename: '[name].js',
    path: outputDir,
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: '@ngtools/webpack',
      },
      {
        test: /\.m?js$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            compact: false,
            plugins: ['@angular/compiler-cli/linker/babel'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          {loader: MiniCssExtractPlugin.loader},
          {loader: 'css-loader', options: {esModule: true}},
        ],
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html'
    }),
    new AngularWebpackPlugin({
      tsconfig: './tsconfig.json',
    }),
    new MiniCssExtractPlugin({
      filename:'[name].css'
    }),
  ]
});
