// @flow
import dotenv from 'dotenv';
import { Logger, transports } from 'winston';
import app from './server/start/route/index';

dotenv.config({ silent: true });

const port = process.env.PORT || 7000;

const logger = new Logger({
  transports: [ new transports.Console() ]
});

app.listen(port, (error) => {
  if (!error) {
    logger.info('App listening on port 7000');
  } else {
    logger.error(error);
  }
});
