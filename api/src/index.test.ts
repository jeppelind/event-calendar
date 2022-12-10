import server from './index';
import { expect, request, use } from "chai";
import chaiHttp = require("chai-http")
import db from './db/mongo-connection';
import sinon from 'sinon';
import * as cache from './cache/cache';

const authToken = process.env.TEST_AUTH_TOKEN

use(chaiHttp);

describe('API', () => {
  it('GET /ping returns status 200 with text', async () => {
    const result = await request(server)
      .get('/ping');

    expect(result).to.have.status(200);
    expect(result.text).to.deep.equal('pong');
  });

  describe('/graphql', () => {
    it('rejects with status 401 on nonauthenticated request', async () => {
      const result = await request(server)
        .post(`/graphql?query={}`)

      expect(result).to.have.status(401);
    });

    it('rejects with status 401 on nonauthorized request', async () => {
      const stub = sinon.stub(db, 'getUserByToken').resolves(null);

      const result = await request(server)
        .post(`/graphql?query={}`)
        .set('Authorization', authToken);

      stub.restore();

      expect(result).to.have.status(401);
    });

    it('returns unauthorized error when user lacks permissions', async () => {
      const stub = sinon.stub(db, 'getUserByToken').resolves({ name: 'Test', token: '', role: 0 });

      const query = `
      mutation {
        deleteEvent(id: "5f63c58c2656c38e30714929")
      }`;
      const result = await request(server)
        .post(`/graphql?query=${query}`)
        .set('Authorization', authToken);

      stub.restore();

      expect(result).to.have.status(200);
      expect(result.body.errors).to.exist;
    });

    it('getUpcomingEvents', async () => {
      const stub = sinon.stub(db, 'getUpcomingEvents').resolves([{ name: 'Testname', startDate: new Date() }]);
      const stub2 = sinon.stub(db, 'getUserByToken').resolves({ name: 'Test', token: '', role: 1 });
      const stub3 = sinon.stub(cache, 'getEventCache').resolves([]);
      const stub4 = sinon.stub(cache, 'setEventCache').resolves('OK');

      const query = `
      {
        getUpcomingEvents {
          name
        }
      }`;
      const result = await request(server)
        .get(`/graphql?query=${query}`)
        .set('Authorization', authToken);

      stub.restore();
      stub2.restore();
      stub3.restore();
      stub4.restore();

      const expected = { data: { getUpcomingEvents: [{ name: 'Testname' }] } }
      expect(result).to.have.status(200);
      expect(result.body).to.deep.equal(expected);
    });

    it('getUpcomingEvents with cache', async () => {
      const stub = sinon.stub(db, 'getUserByToken').resolves({ name: 'Test', token: '', role: 1 });
      const stub2 = sinon.stub(cache, 'getEventCache').resolves([{ name: 'Testname', startDate: new Date() }]);
      const stub3 = sinon.stub(cache, 'setEventCache').resolves('OK');

      const query = `
      {
        getUpcomingEvents {
          name
        }
      }`;
      const result = await request(server)
        .get(`/graphql?query=${query}`)
        .set('Authorization', authToken);

      stub.restore();
      stub2.restore();
      stub3.restore();

      const expected = { data: { getUpcomingEvents: [{ name: 'Testname' }] } }
      expect(result).to.have.status(200);
      expect(result.body).to.deep.equal(expected);
    });

    it('createEvent', async () => {
      const fakeData = {
            name: 'Testname',
            startDate: new Date('2020-12-24'),
      };
      const stub = sinon.stub(db, 'createEvent').resolves(fakeData);
      const stub2 = sinon.stub(db, 'getUserByToken').resolves({ name: 'Test', token: '', role: 1 });
      const stub3 = sinon.stub(cache, 'clearEventCache').resolves(1);

      const query = `
      mutation {
        createEvent(input: { name: "${fakeData.name}", startDate: "2020-12-24" }) {
          name
          startDate
        }
      }`;
      const result = await request(server)
        .post(`/graphql?query=${query}`)
        .set('Authorization', authToken);

      stub.restore();
      stub2.restore();
      stub3.restore();

      const expected = { data: { createEvent: { name: 'Testname', startDate: '2020-12-24T00:00:00.000Z' } } }
      expect(result).to.have.status(200);
      expect(result.body).to.deep.equal(expected);
    });

    it('deleteEvent', async () => {
      const id = '5f63c58c2656c38e30714929';
      const stub = sinon.stub(db, 'deleteEvent').resolves(id);
      const stub2 = sinon.stub(db, 'getUserByToken').resolves({ name: 'Test', token: '', role: 1 });
      const stub3 = sinon.stub(cache, 'clearEventCache').resolves(1);

      const query = `
      mutation {
        deleteEvent(id: "${id}")
      }`;
      const result = await request(server)
        .post(`/graphql?query=${query}`)
        .set('Authorization', authToken);

      stub.restore();
      stub2.restore();
      stub3.restore();

      const expected = { data: { deleteEvent: id } };
      expect(result).to.have.status(200);
      expect(result.body).to.deep.equal(expected);
    });

    it('updateEvent', async () => {
      const fakeData = {
        _id: '12345',
        name: 'Testname',
        startDate: new Date('2020-12-24'),
      };
      const stub = sinon.stub(db, 'updateEvent').resolves(fakeData);
      const stub2 = sinon.stub(db, 'getUserByToken').resolves({ name: 'Test', token: '', role: 1 });
      const stub3 = sinon.stub(cache, 'clearEventCache').resolves(1);

      const query = `
      mutation {
        updateEvent(id: "${fakeData._id}", input: { name: "${fakeData.name}" }) {
          id,
          name
        }
      }`;
      const result = await request(server)
        .post(`/graphql?query=${query}`)
        .set('Authorization', authToken);

      stub.restore();
      stub2.restore();
      stub3.restore();

      const expected = { data: { updateEvent: { id: fakeData._id, name: fakeData.name } } }
      expect(result).to.have.status(200);
      expect(result.body).to.deep.equal(expected);
    });
  });
});
