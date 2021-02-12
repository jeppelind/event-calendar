import server from './index';
import { expect, request, use } from 'chai';
import chaiHttp = require('chai-http');

use(chaiHttp);

describe('Server', ()  => {
  it('GET / returns status 200', async () => {
    const result = await request(server)
      .get('/');
    
    expect(result).to.have.status(200);
  });

  // it('GET /login returns token', async () => {
  //   const result = await request(server)
  //     .get('/login');

  //   expect(result).to.have.status(200);
  // })
});