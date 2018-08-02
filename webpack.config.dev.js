import path from 'path';
import webpack from 'webpack';

const devtool = 'source-map' || 'cheap-module-source-map' || 'eval-source-map' || 'inline-source-map';
export default {
  entry: [ 'babel-polyfill',
    './client/index.js' ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'client/dist/'),
    publicPath: '/',
  },
  mode: 'development',
  devtool: devtool,
  devServer: {
    contentBase: './client/dist',
    hot: true
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin()
  ],
  module: {
    rules:  [
      {
        test: /(\.css|\.scss|\.sass)$/,
        use: [
          'style-loader',
          'css-loader', 'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, 'client/'),
        ],
        use: [ 'babel-loader' ],
        exclude: /(node_modules|bower_components)/,
      }
    ]
  },
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    dns: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  resolve: {
    extensions: [ '.web.js', '.js', '.json', '.web.jsx', '.jsx', '.js.flow' ]
  },
  performance: {
    hints: false
  }
};
