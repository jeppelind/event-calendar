import server from './index';
import { expect, request, use } from "chai";
import chaiHttp = require("chai-http")
import db from './db/mongo-connection';
import sinon from 'sinon';

use(chaiHttp);

describe('API', () => {
  it('GET /ping returns status 200 with text', async () => {
    const result = await request(server)
      .get('/ping');

    expect(result).to.have.status(200);
    expect(result.text).to.deep.equal('pong');
  });

  describe('/graphql', () => {
    it('getUpcomingEvents', async () => {
      const fakeData = [{ name: 'Testname' }];
      const stub = sinon.stub(db, 'getUpcomingEvents').resolves(fakeData);

      const query = `
      {
        getUpcomingEvents {
          name
        }
      }`;
      const result = await request(server)
        .get(`/graphql?query=${query}`);

      stub.restore();

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

      const query = `
      mutation {
        createEvent(input: { name: "${fakeData.name}", startDate: "${fakeData.startDate}" }) {
          name
          startDate
        }
      }`;
      const result = await request(server)
        .post(`/graphql?query=${query}`);

      stub.restore();

      const expected = { data: { createEvent: fakeData } }
      expect(result).to.have.status(200);
      expect(result.body).to.deep.equal(expected);
    });

    it('deleteEvent', async () => {
      const stub = sinon.stub(db, 'deleteEvent').resolves(1);

      const query = `
      mutation {
        deleteEvent(id: "5f63c58c2656c38e30714929")
      }`;
      const result = await request(server)
        .post(`/graphql?query=${query}`);

      stub.restore();

      const expected = { data: { deleteEvent: 1 } };
      expect(result).to.have.status(200);
      expect(result.body).to.deep.equal(expected);
    });

    it('updateEvent', async () => {
      const fakeData = '12345';
      const stub = sinon.stub(db, 'updateEvent').resolves(fakeData);

      const query = `
      mutation {
        updateEvent(id: "${fakeData}", input: { name: "New name" })
      }`;
      const result = await request(server)
        .post(`/graphql?query=${query}`);

      stub.restore();

      const expected = { data: { updateEvent: fakeData } }
      expect(result).to.have.status(200);
      expect(result.body).to.deep.equal(expected);
    });
  });
});
