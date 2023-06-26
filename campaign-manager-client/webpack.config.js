const path = require('path');

module.exports = {
  entry: './src/index.ts', // note the .ts extension
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'], // resolve these extensions
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // use ts-loader for .ts and .tsx files
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
