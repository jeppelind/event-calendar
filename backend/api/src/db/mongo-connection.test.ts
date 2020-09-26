import { expect, use } from "chai";
import chaiExclude from 'chai-exclude';
import { connect, connection, disconnect } from "mongoose";
import db, { EventDBModel, UserDBModel } from "./mongo-connection"

use(chaiExclude);

describe('mongo-connection.ts', () => {
  beforeEach('Setup database', () => {
    connect(process.env.MONGODB_TEST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  })

  afterEach('Clean up database', async () => {
    await connection.dropDatabase();
    await disconnect();
  });

  describe('createEvent()', () => {
    it('saves new event to database', async () => {
      const expected = {
        name: 'test',
        description: 'test event',
        startDate: new Date('2020-11-24'),
        endDate: new Date('2020-11-26')
      }
      const result = await db.createEvent('test', '2020-11-24', '2020-11-26', 'test event');
      expect(result.errors).to.be.undefined;
      expect(result).excluding(['__v', '_id']).to.deep.equal(expected);
    });
  });

  describe('deleteEvent()', () => {
    it('deletes event based on id and returns number of deleted items', async () => {
      const fakeData = {
        name: 'Test',
        startDate: Date.now(),
      }
      const doc = await EventDBModel.create(fakeData);

      const result = await db.deleteEvent(doc.id);
      expect(result).to.equal(1);
    });

    it('returns zero deletion count when id is not found', async () => {
      const result = await db.deleteEvent('5f620394e465321e1e210fa0');
      expect(result).to.equal(0);
    });
  });

  describe('updateEvent()', () => {
    it('updates existing event', async () => {
      const fakeData = {
        name: 'Test',
        description: 'Test desc',
        startDate: Date.now(),
        endDate: Date.now(),
      }
      const doc = await EventDBModel.create(fakeData);

      const result = await db.updateEvent(doc.id, 'Test2', '2020-10-24', '2020-10-26', 'Test desc 2');
      expect(result.errors).to.be.undefined;
    });

    it('returns null when no item is found', async () => {
      const result = await db.updateEvent('5f63c5942656c38e3071492b', 'Test', '2020-10-24', '2020-10-26', 'Test desc');
      expect(result).to.be.null;
    });
  });

  describe('getUpcomingEvents()', () => {
    it('returns array of upcoming events', async () => {
      const fakeData = [
        {
          name: 'Event 1',
          startDate: Date.now() + 10000,
        },
        {
          name: 'Event 2',
          startDate: Date.now() + 10000,
        }
        ,
        {
          name: 'Event 3',
          startDate: Date.now() - 10000,
        }
      ];
      await EventDBModel.create(fakeData);

      const result = await db.getUpcomingEvents();
      expect(result.length).to.equal(2);
    });
  });

  describe('getUserByToken()', () => {
    it('returns user object given token', async () => {
      const fakeData = {
        name: 'Test',
        role: 13,
        token: 'abc',
      };
      await UserDBModel.create(fakeData);

      const result = await db.getUserByToken('abc');
      const expected = { name: 'Test', role: 13 };
      expect(result).excluding(['__v', '_id']).to.deep.equal(expected);
    });

    it('returns null when no user is found', async () => {
      const result = await db.getUserByToken('def');
      expect(result).to.be.null;
    });
  });
});
