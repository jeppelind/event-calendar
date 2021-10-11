import { describe, it } from 'mocha';
import { expect, use } from 'chai';
import supertest from 'supertest';
import sinon from 'sinon';
import chaiHttp = require('chai-http');
import * as nodeFetch from 'node-fetch';
import server from './index';

use(chaiHttp);

describe('index.ts', () => {
  describe('/ping', () => {
    it('GET /ping returns status 200', async () => {
      const result = await supertest(server)
        .get('/ping');
      expect(result).to.have.status(200);
      expect(result.text).to.equal('pong');
    });
  });

  describe('/graphql', () => {
    it('POST /graphql returns status 200', async () => {
      const mockResult = {
        users: 4,
      };
      const stub = sinon.stub(nodeFetch, 'default').resolves(new nodeFetch.Response(JSON.stringify(mockResult)));
      const result = await supertest(server)
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({ query: '{getUsersCount()}' });

      stub.restore();

      expect(result).to.have.status(200);
      expect(result.body).to.deep.equal(mockResult);
    });
  });
});
