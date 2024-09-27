/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = (env, argv) => {
  console.log('env.NODE_ENV', env.NODE_ENV);
  console.log('Full env object:', env);
  const nodeEnv = env.NODE_ENV || 'development';
  const baseConfig = {
    entry: ['./src/main.ts'],
    target: 'node',
    externals: [nodeExternals(['aws-lambda'])],
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
    mode: nodeEnv === 'production' ? 'production' : 'development',
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

  if (nodeEnv !== 'production') {
    // Development-specific settings
    console.log('entered into development mode');
    return {
      ...baseConfig,
      entry: ['webpack/hot/poll?100', './src/main.ts'],
      watch: true,
      externals: [
        nodeExternals({
          allowlist: ['webpack/hot/poll?100', ['aws-lambda']],
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
