import * as path from 'path';
import linkerPlugin from '@angular/compiler-cli/linker/babel'
import {fileURLToPath} from "url";
import 'html-webpack-plugin'
import HtmlWebpackPlugin from "html-webpack-plugin";
import {AngularWebpackPlugin} from '@ngtools/webpack';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const outputDir =  rootDir + "/distW";
export default (a, b, c) => {
  return {
    entry: {
      polyfills: {import: "./src/polyfills.ts"},
      main: {import: ["./src/main.ts", "./src/environments/environment.ts"]},
      styles: "./src/styles.css",
    },
    target: ['web', 'es2015'],
    devtool: 'eval-source-map',
    output: {
      filename: "[name].[contenthash].js",
      path: outputDir,
      chunkFilename: "[id].chunk.js",
      clean: true,
    },
    plugins: [
      new HtmlWebpackPlugin(),
      new AngularWebpackPlugin({
        directTemplateLoading: true,
        tsconfig: rootDir + '/tsconfig.json',
      })
    ],
    resolve: {
      extensions: ['.js','.ts'],
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          loader: '@ngtools/webpack',
          exclude: {and:[/node_modules/]},
        },
        {
          test: /\.[cm]?js$/,
          exclude: rootDir+'/node_modules/',
          resolve: {fullySpecified: false},
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              compact: false,
              plugins: [ linkerPlugin],
            },
          },
        },
        {
          test: /\.html$/i,
          type: "asset/source",
          use: [
              { loader: "html-loader", options: { sources: false } }
          ]
        },
        {
          test: /.css$/,
          use: [
            {loader: "style-loader"},
            {loader: "css-loader", options: {modules: true}},
          ],
        },
      ],
    },
    optimization: {
      splitChunks: {
        chunks: "async",
      },
    },
    devServer: {
      client: {
        overlay: {
          errors: true,
          warnings: false
        }
      },
      static: {
        directory: outputDir,
      },
      compress: true,
      allowedHosts: "all",
      historyApiFallback: true,
      hot: false,
      port: 4200
    }

  };
}
