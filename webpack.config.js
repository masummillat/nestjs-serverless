const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const environment = env.NODE_ENV || 'local';

  return {
    entry: ['webpack/hot/poll?100', './src/main.ts'],
    target: 'node',
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100'],
      }),
    ],
    module: {
      rules: [
        {
          test: /.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    mode: isProduction ? 'production' : 'development',
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/],
      }),
      new RunScriptWebpackPlugin({ name: 'server.js', autoRestart: false }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(environment),
      }),
    ],
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'server.js',
    },
  };
};
