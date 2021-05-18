import { expect, use } from 'chai';
import chaiExclude from 'chai-exclude';
import bcrypt from 'bcrypt';
import dbWrapper from './db-wrapper';
import sinon from 'sinon';
import { changeUserPassword, createNewUser, getUserByEmail, getUserById, validatePassword } from './user';

use(chaiExclude);

const hashedPwd = bcrypt.hashSync('abc123', 10);
const fakeData = {
    _id: '123',
    email: 'test@test.com',
    name: 'Tester',
    password: hashedPwd,
    token: 'abc',
    role: 1,
}

describe('user.ts', () => {
  describe('getUserByEmail', () => {
    it('returns user object with given email', async () => {
      const stub = sinon.stub(dbWrapper, 'getUser').resolves(fakeData);
      const result = await getUserByEmail('test@test.com');
      stub.restore();

      expect(result).excluding(['__v']).to.deep.equal(fakeData);
    });
  });

  describe('getUserById', () => {
    it('returns user object with given id', async () => {
      const stub = sinon.stub(dbWrapper, 'getUserById').resolves(fakeData);
      const result = await getUserById('123');
      stub.restore();

      expect(result).excluding(['__v']).to.deep.equal(fakeData);
    });
  });

  describe('validatePassword', () => {
    it('returns true if password is correct', async () => {
      const result = await validatePassword('abc123', fakeData.password);
      expect(result).to.be.true;
    });

    it('returns false if password is incorrect', async () => {
      const result = await validatePassword('abc1234', fakeData.password);
      expect(result).to.be.false;
    });
  });

  describe('createNewUser', () => {
    it('returns created user id', async () => {
        const stub = sinon.stub(dbWrapper, 'addUser').resolves(fakeData);
        const result = await createNewUser('test@mail.com', 'abc123', 1);
        stub.restore();

        expect(result).to.equal('123');
    });

    it('throws error when email is already in use', async () => {
        const stub = sinon.stub(dbWrapper, 'addUser').throws('Email already in use.');
        let result = null;
        try {
            await createNewUser('test@mail.com', 'abc123', 1)
        } catch (err) {
            result = err;
        }
        stub.restore();

        expect(result).to.be.an('Error');
    });
  });

  describe('changeUserPassword', () => {
    it('returns user id on success', async () => {
        const stub = sinon.stub(dbWrapper, 'getUserById').resolves(fakeData);
        const stub2 = sinon.stub(dbWrapper, 'changePassword').resolves(fakeData);
        const result = await changeUserPassword('123', 'abc123', 'abc456');

        stub.restore();
        stub2.restore();

        expect(result).to.equal('123');
    });
  });
});
