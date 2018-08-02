// @flow
import httpMocks from 'node-mocks-http';
import sinon from 'sinon';
import events from 'events';
import supertest from 'supertest';
import app from '../route/index';
import Authentication from './Authentication';
import helper from '../../controllers/helpers/modelHelper';
import db from '../../models';

const superRequest = supertest.agent(app);
let adminJwtToken;
let userJwtToken;
let request;

const responseEvent = () => httpMocks.
  createResponse({ eventEmitter: events.EventEmitter });

describe('Middleware Test suite', () => {
  beforeAll(() => {
    db.Role.bulkCreate([ { title: 'admin', id: 1 }, { title: 'regular', id: 2 } ]);

    superRequest
      .post('/user/login')
      .send(helper.createAdmin())
      .end((err, res) => {
        adminJwtToken = res.body.token;
        superRequest
          .post('/user/login')
          .send(helper.createUser())
          .end((err, res) => {
            userJwtToken = res.body.token;
          });
      });
  });

  afterAll(async() => await db.Role.sequelize.sync({ force: true }));

  describe('Verify Token', () => {
    it('should authenticate the user if token is valid', () => {
      const response = httpMocks.createResponse();
      request = httpMocks.createRequest({
        method: 'GET',
        url: '/user',
        headers: { 'x-access-token': adminJwtToken }
      });
      const middlewareStub = {
        callback: () => { }
      };
      sinon.spy(middlewareStub, 'callback');
      Authentication.verifyToken(request, response, middlewareStub.callback);
      expect(middlewareStub.callback).toHaveBeenCalled;
    });
  });
});
