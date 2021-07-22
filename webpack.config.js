const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
		fallback: {
			fs: false,
			path: false
		}
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'docs/assets/js'),
    libraryTarget: "var",
    library: "LiquidLspEngine"
  },
};
