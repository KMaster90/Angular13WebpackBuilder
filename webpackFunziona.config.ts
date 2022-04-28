import * as path from 'path';
import {fileURLToPath} from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import {AngularWebpackPlugin} from '@ngtools/webpack'
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import webpack from "webpack";

// const rootDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname);
const outputDir = rootDir + "/distF";
export default (a, b, c) => {
  return {
    devServer: {
      compress: true,
      historyApiFallback: true,
      port: 5200
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
      filename: "[name].[contenthash].js",
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
        // Process component stylesheets
        {
          test: /\.css$/,
          use: ['to-string-loader', 'css-loader'],
          exclude: rootDir + '/src/styles.css'
        },
        {
          test: /\.css$/i,
          use: [
            {loader: MiniCssExtractPlugin.loader},
            {loader: 'css-loader', options: {esModule: true}},
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    [
                      'autoprefixer',
                      {
                        // Options
                      },
                    ],
                  ],
                },
              },
            },
          ],
        },
        {
          parser: {system: true},
          test: /[/\\]@angular[/\\]core[/\\].+\.js$/,
        },
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/index.html'
      }),
      new AngularWebpackPlugin({
        tsconfig: rootDir + '/tsconfig.json',
      }),
      new MiniCssExtractPlugin({
        filename: 'public/css/[name].css',
      }),
      new webpack.ProvidePlugin(
        {process: require.resolve('process/browser'),}
      )
    ],

    optimization: {
      moduleIds: 'deterministic',
      minimize: false,
      splitChunks: {

        cacheGroups: {
          styles: {
            name: "styles",
            type: "css/mini-extract",
            chunks: "all",
            enforce: true,
          },
        },
      },
    },
  };
}
