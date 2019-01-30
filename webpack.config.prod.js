import path from 'path';
import webpack from 'webpack';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';

export default {
  entry: [ '@babel/polyfill',
    './client/index.js' ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'client/dist/'),
    publicPath: '/',
  },
  devtool: 'source-map',
  mode: 'production',
  devServer: {
    contentBase: './client/dist',
    hot: true
  },
  target: 'web',
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new UglifyJSPlugin({
      sourceMap: true
    }),
  ]
};
