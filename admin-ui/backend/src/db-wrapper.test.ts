import { expect, use } from 'chai';
import chaiExclude from 'chai-exclude';
import { connect, connection, disconnect } from 'mongoose';
import db, { UserModel } from './db-wrapper';

use(chaiExclude);

describe('db-wrapper.ts', () => {
  beforeEach('Setup database', () => {
    connect(process.env.MONGODB_TEST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  });

  afterEach('Clean up database', async () => {
    await connection.dropDatabase();
    await disconnect();
  });

  describe('getUser()', () => {
    it('returns valid user', async () => {
      const fakeData = {
        email: 'test@test.com',
        name: 'Tester',
        password: 'abc123',
      }
      await UserModel.create(fakeData);

      const result = await db.getUser('test@test.com');
      expect(result).excluding(['__v', '_id']).to.deep.equal(fakeData);
    });

    it('returns null when not provided correct email', async () => {
      const fakeData = {
        email: 'test@test.com',
        name: 'Tester',
        password: 'abc123',
      }
      await UserModel.create(fakeData);

      const result = await db.getUser('test2@test.com');
      expect(result).to.be.null;
    });
  });
});
