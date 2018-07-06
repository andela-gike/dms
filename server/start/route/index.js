// @flow
import express from 'express';
import logger from 'winston';
import bodyParser from 'body-parser';
import endpoint from './endpoints';

// Set up the express app
const app = express();
// Log requests to the console.

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

logger.log('dev');
endpoint(app);

app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of dms server side.',
}));

export default app;
