module.exports = {
  entry: './src/react-image-diff.jsx',
  output: {
    filename: './dist/react-image-diff.js',
    libraryTarget: 'umd',
    library: 'ImageDiff',
  },
  externals: [{
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
  }],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
    }],
  },
};
