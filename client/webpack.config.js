const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-hot-middleware/client',
    './src/index.tsx'
  ],
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['ts-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}; 