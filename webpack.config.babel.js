import webpack from 'webpack'
import path from 'path'
import { execSync } from 'child_process'
import { name, version } from './package.json'

const config = {
  entry: {
    'trackerDemo': [
      'webpack-dev-server/client?http://0.0.0.0:3000',
      __dirname + '/demo/js/index.js',
    ],
    'cytronTracker': __dirname + '/src/index.js',
  },
  output: {
    path: 'dist/',
    filename: '[name].js',
    publicPath: 'build/',
  },
  eslint: {
    fix: true,
  },
  profile: false,
  module: {
    preLoaders: [{
      test: /\.jsx?$/,
      // exclude: /node_modules|dist|build|demo|doc/,
      include: [
        path.join(__dirname, 'src'),
        path.join(__dirname, 'demo'),
      ],
      // if you follow along, that will make sure our code style unified
      loaders: ['eslint-loader'],
    }],
    loaders: [{
      test: /\.jsx?$/,
      include: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'demo'),
        // path.resolve(__dirname, 'config'),
      ],
      loaders: ['babel'],
    },
    { test: /\.(jpg|jpeg|png|gif|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=10000' },
  ],
  },
  resolve: {
    // which file extension can be require or import "name" without specify .js .jsx
    extensions: ['', '.js', '.jsx'],
    alias: {
      'cy-lib': path.resolve(__dirname, 'src/_lib'),
      'classnames': path.resolve(__dirname, 'src/utils/classnames'),
    },
  },
  devServer: {
    port: process.env.PORT || 3000,
    contentBase: './demo',
    host: '0.0.0.0',
    // Config for minimal console.log mess.
    stats: {
      colors: true,
      version: true,
      timings: true,
      chunks: false,
    },
  },
  plugins: [
    new webpack.BannerPlugin(
      `       ______      __
    / ____/_  __/ /__________  ____
   / /   / / / / __/ ___/ __ \\/ __ \\
  / /___/ /_/ / /_/ /  / /_/ / / / /
  \\____/\\__, /\\__/_/   \\____/_/ /_/    Cytron™ by Eisneim
       /____/

  ${name}@${version} updated on ${new Date().toLocaleString()}
****************************************************************`
    ),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        NAME: name,
        VERSION: version,
        COMMIT: execSync('git rev-parse --short HEAD').toString().replace('\n', ''),
        BUILD_DATE: new Date(),
        DEBUG: process.env !== 'production',
      }),
    }),
  ],
}

export default config
