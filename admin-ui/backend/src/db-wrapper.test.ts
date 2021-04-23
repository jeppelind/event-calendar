import { expect, use } from 'chai';
import chaiExclude from 'chai-exclude';
import { connect, connection, disconnect } from 'mongoose';
import dbWrapper, { UserModel } from './db-wrapper';

use(chaiExclude);

const fakeData = {
  email: 'test@test.com',
  name: 'Tester',
  password: 'abc123',
}
const populateDBWithFakeData = async () => {
  await UserModel.create(fakeData);
}

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

  describe('getUser', () => {
    it('returns valid user', async () => {
      await populateDBWithFakeData();

      const result = await dbWrapper.getUser('test@test.com');
      expect(result).excluding(['__v', '_id', 'id']).to.deep.equal(fakeData);
    });

    it('returns null when not provided existing email', async () => {
      await populateDBWithFakeData();

      const result = await dbWrapper.getUser('test2@test.com');
      expect(result).to.be.null;
    });
  });

  describe('addUser', () => {
    it('saves new user to database', async () => {
      const result = await dbWrapper.addUser('new@mail.com', 'abc123', 'New User');
      const expected = {
        name: 'New User',
        email: 'new@mail.com',
        password: 'abc123',
      }
      expect(result).excluding(['__v', '_id', 'id']).to.deep.equal(expected);
    });

    it('throws error if email exists in database', async () => {
      await populateDBWithFakeData();

      let result = null;
        try {
            await dbWrapper.addUser('test@test.com', 'abc456', 'New User');
        } catch (err) {
            result = err;
        }
        expect(result).to.be.an('Error')
        expect(result.message).to.equal('Email already in use.');
    });
  });

  describe('updateUser', () => {
    it('updates existing user', async () => {
      await populateDBWithFakeData();

      const result = await dbWrapper.updateUser('test@test.com', 'New User');
      expect(result).to.not.equal(null);
    });

    it('returns null when no user is found', async () => {
      const result = await dbWrapper.updateUser('test@test.com', 'New User');
      expect(result).to.equal(null);
    });
  });

  describe('changePassword', () => {
    it('updates password given user and existing password', async () => {
      await populateDBWithFakeData();

      const result = await dbWrapper.changePassword('test@test.com', 'abc123', 'abc456');
      const expected = {
        email: 'test@test.com',
        name: 'Tester',
        password: 'abc456',
      };
      expect(result).excluding(['__v', '_id', 'id']).to.deep.equal(expected);
    });

    it('throws error if email and existing password is incorrect', async () => {
      await populateDBWithFakeData();

      let result = null;
        try {
            await dbWrapper.changePassword('test@test.com', 'wrongPwd', 'abc456');
        } catch (err) {
            result = err;
        }
        expect(result).to.be.an('Error');
    }); 
  })
});
