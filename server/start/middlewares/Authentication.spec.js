// @flow
/* eslint no-underscore-dangle: 0 */
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

    it('Should prevent access if token is invalid', () => {
      const response = responseEvent();
      request = httpMocks.createRequest({
        method: 'GET',
        url: '/user',
        headers: { 'x-access-token': 'Invalid Token' }
      });
      const middlewareStub = {
        callback: () => { }
      };
      sinon.spy(middlewareStub, 'callback');
      Authentication.verifyToken(request, response, middlewareStub.callback);
      response.on('end', () => {
        expect(response._getData().message).toEqual('Invalid Token');
      });
    });
  });

  describe('Check Admin Access', () => {
    it('should restrict if requester is not an admin user', () => {
      const response = responseEvent();
      request = httpMocks.createRequest({
        method: 'GET',
        url: '/roles',
        headers: { 'x-access-token': userJwtToken },
        decodedToken: { roleId: 2 }
      });
      const middlewareStub = {
        callback: () => { }
      };
      sinon.spy(middlewareStub, 'callback');
      Authentication.hasAdminPermission(request, response, middlewareStub.callback);
      response.on('end', () => {
        expect(response._getData().message).toEqual('Permission denied, admin only');
      });
    });

    it('Should continue for admin user', () => {
      const response = responseEvent();
      request = httpMocks.createRequest({
        method: 'GET',
        url: '/roles',
        headers: { 'x-access-token': userJwtToken },
        decodedToken: { roleId: 1 }
      });
      const middlewareStub = {
        callback: () => { }
      };
      sinon.spy(middlewareStub, 'callback');
      Authentication.hasAdminPermission(request, response, middlewareStub.callback);
      expect(middlewareStub.callback).toHaveBeenCalled;
    });
  });
});
