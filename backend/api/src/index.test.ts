import server from './index';
import { expect, request, use } from "chai";
import chaiHttp = require("chai-http")
import db from './db/mongo-connection';
import sinon from 'sinon';

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
      const stub = sinon.stub(db, 'getUserByToken').resolves({ name: 'Test', role: 0 });

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
      const fakeData = [{ name: 'Testname' }];
      const stub = sinon.stub(db, 'getUpcomingEvents').resolves(fakeData);
      const stub2 = sinon.stub(db, 'getUserByToken').resolves({ name: 'Test', role: 1 });

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

      const expected = { data: { getUpcomingEvents: fakeData } }
      expect(result).to.have.status(200);
      expect(result.body).to.deep.equal(expected);
    });

    it('createEvent', async () => {
      const fakeData = {
            name: 'Testname',
            startDate: '2020-12-24'
      };
      const stub = sinon.stub(db, 'createEvent').resolves(fakeData);
      const stub2 = sinon.stub(db, 'getUserByToken').resolves({ name: 'Test', role: 1 });

      const query = `
      mutation {
        createEvent(input: { name: "${fakeData.name}", startDate: "${fakeData.startDate}" }) {
          name
          startDate
        }
      }`;
      const result = await request(server)
        .post(`/graphql?query=${query}`)
        .set('Authorization', authToken);

      stub.restore();
      stub2.restore();

      const expected = { data: { createEvent: fakeData } }
      expect(result).to.have.status(200);
      expect(result.body).to.deep.equal(expected);
    });

    it('deleteEvent', async () => {
      const stub = sinon.stub(db, 'deleteEvent').resolves(1);
      const stub2 = sinon.stub(db, 'getUserByToken').resolves({ name: 'Test', role: 1 });

      const query = `
      mutation {
        deleteEvent(id: "5f63c58c2656c38e30714929")
      }`;
      const result = await request(server)
        .post(`/graphql?query=${query}`)
        .set('Authorization', authToken);

      stub.restore();
      stub2.restore();

      const expected = { data: { deleteEvent: 1 } };
      expect(result).to.have.status(200);
      expect(result.body).to.deep.equal(expected);
    });

    it('updateEvent', async () => {
      const fakeData = '12345';
      const stub = sinon.stub(db, 'updateEvent').resolves(fakeData);
      const stub2 = sinon.stub(db, 'getUserByToken').resolves({ name: 'Test', role: 1 });

      const query = `
      mutation {
        updateEvent(id: "${fakeData}", input: { name: "New name" })
      }`;
      const result = await request(server)
        .post(`/graphql?query=${query}`)
        .set('Authorization', authToken);

      stub.restore();
      stub2.restore();

      const expected = { data: { updateEvent: fakeData } }
      expect(result).to.have.status(200);
      expect(result.body).to.deep.equal(expected);
    });
  });
});
