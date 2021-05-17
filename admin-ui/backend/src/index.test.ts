import { expect, use } from 'chai';
import chaiHttp = require('chai-http');
import sinon from 'sinon';
import * as user from './user';
import * as authentication from './authentication';
import express from 'express';
import supertest from 'supertest';

use(chaiHttp);

const fakeData = {
  _id: '123',
  email: 'test@test.com',
  name: 'Tester',
  password: 'raft',
  token: 'abc',
  role: 1,
}

describe('index.ts', ()  => {
  let server: express.Express;
  let authMiddlewareStub: sinon.SinonStub;

  before(() => {
    authMiddlewareStub = sinon.stub(authentication, 'authenticateUserMiddleware')
      .callsFake((req, res, next) => next());

    // Need to import servar AFTER middleware has been stubbed.
    server = require('./index').default;
  });

  after(() => {
    authMiddlewareStub.restore();
    delete require.cache[require.resolve('./index')];
  });

  describe('/', () => {
    it('GET / returns status 200', async () => {
      const result = await supertest(server)
        .get('/');
      expect(result).to.have.status(200);
    });
  });

  describe('/login', () => {
    it('POST /login redirects with status 302', async () => {
      const stub = sinon.stub(user, 'getUserByEmail').resolves(fakeData);
      const stub2 = sinon.stub(user, 'validatePassword').resolves(true);
      const stub3 = sinon.stub(user, 'getUserData').resolves({
        name: fakeData.name,
        email: fakeData.email,
        role: fakeData.role,
      });

      const result = await supertest(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'test@test.com',
          password: 'arst'
        });

      stub.restore();
      stub2.restore();
      stub3.restore();

      expect(result).to.have.status(302);
    });
  });

  describe('/logout', () => {
    it('GET /logout returns status 200', async () => {
      const result = await supertest(server)
        .get('/logout');
      expect(result).to.have.status(200);
    });
  });

  describe('/user/get', () => {
    it('GET /user/get returns status 200', async () => {
      const stub = sinon.stub(user, 'getUserData').resolves({
        name: fakeData.name,
        email: fakeData.email,
        role: fakeData.role,
      });
      const result = await supertest(server)
        .get('/user/get');

      stub.restore();

      expect(result).to.have.status(200);
    });
  });

  describe('/user/add', () => {
    it('POST /user/add returns status 200', async () => {
      const stub = sinon.stub(user, 'createNewUser').resolves('123');
      const result = await supertest(server)
        .post('/user/add')
        .set('Content-Type', 'application/json')
        .send({
          email: 'test@test.com',
          password: 'abc123',
          role: 2,
          name: 'test',
        });

      stub.restore();

      expect(result).to.have.status(200);
    });
  });
});
