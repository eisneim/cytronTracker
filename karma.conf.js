const path = require('path')

module.exports = function main(config) {
  config.set({
    autoWatchBatchDelay: 500,
    frameworks: [ 'mocha' ],
    reporters: [ 'mocha', 'coverage' ],
    coverageReporter: {
      reporters: [
        { type: 'text-summary' },
        {
          type: 'html',
          dir: 'coverage',
        },
      ],
    },
    browsers: [ 'PhantomJS' ],
    // http://karma-runner.github.io/0.13/config/files.html
    files: [
      { pattern: 'testPolyfill.js', inclueded: true, watched: false, served: true },
      { pattern: 'src/**/*.spec.js', inclueded: false, watched: false },
    ],
    preprocessors: {
      'test/*.js': [ 'webpack' ],
      'src/**/*.js': [ 'webpack' ],
      '**/*.js': [ 'sourcemap' ],
    },
    webpack: {
      // https://github.com/MoOx/eslint-loader
      // eslint options
      eslint: {
        fix: false,
      },
      module: {
        preLoaders: [
          // {
          // // only process .js or .jsx file
          // test: /\.jsx?$/,
          // // ignore any file from node_modules
          // exclude: /node_modules|dist|build|demo|doc/,
          // // include: path.join(__dirname, "src"),
          // // use eslint for linting(syntax checking),
          // // if you follow along, that will make sure our code style unified
          // loaders: ["eslint-loader"],
          // }
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel',
          },
        ],
        loaders: [
          {
            test: /\.jsx?$/,
            loader: 'isparta', // for coverage
            include: /src/,
          },
        ],
      }, // end of module
      resolve: {
        modulesDirectories: [ __dirname, 'node_modules' ],
        alias: {
          'cy-lib': path.resolve(__dirname, 'src/_lib'),
          'cy-config': path.resolve(__dirname, 'src/config'),
        },
      },
    }, // end of webpack
    webpackMiddleware: {
      noInfo: true,
    },
  })
}