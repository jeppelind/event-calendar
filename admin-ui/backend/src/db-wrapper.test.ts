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
        name: 'Tester',
        password: 'abc123',
      }
      await UserModel.create(fakeData);

      const result = await db.getUser('Tester', 'abc123');
      const expected = { name: 'Tester' };
      expect(result).excluding(['__v', '_id']).to.deep.equal(expected);
    });

    it('returns null when not provided correct password', async () => {
      const fakeData = {
        name: 'Tester',
        password: 'abc123',
      }
      await UserModel.create(fakeData);

      const result = await db.getUser('Tester', 'abc125');
      expect(result).to.be.null;
    });

    it('returns null when not provided correct username', async () => {
      const fakeData = {
        name: 'Tester',
        password: 'abc123',
      }
      await UserModel.create(fakeData);

      const result = await db.getUser('Tester2', 'abc123');
      expect(result).to.be.null;
    });
  });
});
