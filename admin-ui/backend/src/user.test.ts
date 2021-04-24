import { expect, use } from 'chai';
import chaiExclude from 'chai-exclude';
import bcrypt from 'bcrypt';
import dbWrapper from './db-wrapper';
import sinon from 'sinon';
import { changeUserPassword, createNewUser, getUserObject } from './user';

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
  describe('getUserObject', () => {
    it('returns user object', async () => {
        const stub = sinon.stub(dbWrapper, 'getUser').resolves(fakeData);
        const result = await getUserObject('test@test.com', 'abc123');

        stub.restore();

        const expected = { id: fakeData._id, email: fakeData.email, name: fakeData.name, token: fakeData.token };
        expect(result).to.deep.equal(expected);
    });

    it('throws error when no user is found', async () => {
        const stub = sinon.stub(dbWrapper, 'getUser').resolves(null);
        let result = null;
        try {
            await getUserObject('test@test.com', 'abc123');
        } catch (err) {
            result = err;
        }

        stub.restore();

        expect(result).to.be.an('Error')
        expect(result.message).to.equal('User not found.');
    });

    it('throws error when password is wrong', async () => {
        const stub = sinon.stub(dbWrapper, 'getUser').resolves(fakeData);
        let result = null;
        try {
            await getUserObject('test@test.com', 'abc124');
        } catch (err) {
            result = err;
        }

        stub.restore();

        expect(result).to.be.an('Error')
        expect(result.message).to.equal('Incorrect password.');
    });

    it('throws error when user lacks access', async () => {
        const testData = { ...fakeData, ...{ role: 0 } }
        const stub = sinon.stub(dbWrapper, 'getUser').resolves(testData);
        let result = null;
        try {
            await getUserObject('test@test.com', 'abc123');
        } catch (err) {
            result = err;
        }

        stub.restore();

        expect(result).to.be.an('Error')
        expect(result.message).to.equal('Access denied.');
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
        const updatedData = {...fakeData, ...{ password: 'abc456' }}
        const stub2 = sinon.stub(dbWrapper, 'changePassword').resolves(fakeData);
        const result = await changeUserPassword('123', 'abc123', 'abc456');

        stub.restore();
        stub2.restore();

        expect(result).to.equal('123');
    });
  });
});
