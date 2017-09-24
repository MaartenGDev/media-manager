const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  target: 'node',
  entry: {
    dist: ['./src/media-manager.js', './src/media-manager.sass'],
  },
  output: {
    filename: 'media-manager.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'media-manager',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.sass/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader'],
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('media-manager.min.css')
  ]
}
