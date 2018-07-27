// @flow
import express from 'express';
import logger from 'winston';
import bodyParser from 'body-parser';
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import endpoint from './endpoints';
import webpackConfig from '../../../webpack.config.dev';

// Set up the express app
const app = express();
// Log requests to the console.
const compiler = webpack(webpackConfig);
// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

logger.log('dev');
endpoint(app);

if (process.env.NODE_ENV !== 'test') {
  app.use(webpackDevMiddleware(compiler, {
    hot: true,
    publicPath: webpackConfig.output.publicPath,
    noInfo: true
  }));

  app.use(webpackHotMiddleware(compiler, {
    hot: true,
    publicPath: webpackConfig.output.publicPath,
    noInfo: false
  }));
}

// Set public directory
app.use(express.static(path.resolve(__dirname, '../../../client/')));

app.get('*', (req, res) => res.status(200)
  .sendFile(path.join(__dirname, '../../../client/index.html')));

export default app;
