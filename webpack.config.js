var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var plugins = [
  new webpack.optimize.CommonsChunkPlugin('common.js'),
  new ExtractTextPlugin("style.css")
];

var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src/main.js');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');

module.exports = {
  entry: [APP_PATH],
  output: {
    path: BUILD_PATH,
    filename: 'build.js',
    publicPath: __dirname + '/build/'
  },
  resolve: {
    extensions: ['', '.js', '.vue']
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style-loader", 'css-loader')
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      }
    ]
  },
  vue: {
    css: ExtractTextPlugin.extract("css"),
    sass: ExtractTextPlugin.extract("css!sass-loader")
  },
  plugins: plugins
}
