/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = (env, argv) => {
  const isProduction = env.NODE_ENV === 'prod';

  const baseConfig = {
    entry: ['./src/main.ts'],
    target: 'node',
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    mode: isProduction ? 'production' : 'development',
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'server.js',
      libraryTarget: 'commonjs2',
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
      }),
    ],
  };

  if (!isProduction) {
    // Development-specific settings
    return {
      ...baseConfig,
      entry: ['webpack/hot/poll?100', './src/main.ts'],
      watch: true,
      externals: [
        nodeExternals({
          allowlist: ['webpack/hot/poll?100'],
        }),
      ],
      plugins: [
        ...baseConfig.plugins,
        new webpack.HotModuleReplacementPlugin(),
        new webpack.WatchIgnorePlugin({
          paths: [/\.js$/, /\.d\.ts$/],
        }),
        new RunScriptWebpackPlugin({ name: 'server.js', autoRestart: false }),
      ],
    };
  } else {
    // Production-specific settings
    return {
      ...baseConfig,
      optimization: {
        minimize: true,
      },
    };
  }
};
