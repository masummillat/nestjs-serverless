/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = (env, argv) => {
  const nodeEnv = env.NODE_ENV || 'development';
  const baseConfig = {
    entry: ['./src/main.ts'],
    target: 'node',
    externals: [nodeExternals()],
    stats: {
      errorDetails: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    mode: nodeEnv === 'prod' ? 'production' : 'development',
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'server.js',
      libraryTarget: 'commonjs2',
    },
    plugins: [new webpack.EnvironmentPlugin(['NODE_ENV'])],
  };

  if (nodeEnv !== 'prod') {
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
