import server from './index';
import { expect, request, use } from "chai";
import chaiHttp = require("chai-http")
use(chaiHttp);

describe('API', () => {
  it('GET /ping returns status 200 with text', async () => {
    const result = await request(server)
      .get('/ping');

    expect(result).to.have.status(200);
    expect(result.text).to.deep.equal('pong');
  });
});
