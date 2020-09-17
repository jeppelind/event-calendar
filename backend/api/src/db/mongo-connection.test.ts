import { expect } from "chai";
import { connect, connection, disconnect, model } from "mongoose";
import { createEvent, deleteEvent, updateEvent, getUpcomingEvents } from "./mongo-setup"
import { eventSchema } from "./schemas";

describe('mongo-connection.ts', () => {
  beforeEach('Setup database', () => {
    connect('mongodb://localhost:27017/TEST_DB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  })

  afterEach('Clean up database', async () => {
    connect('mongodb://localhost:27017/TEST_DB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = connection;
    await db.dropDatabase();
    await disconnect();
  });

  describe('createEvent()', () => {
    it('saves new event to database', async () => {
      const result = await createEvent('test', '2020-10-24', '2020-10-26', 'test event');
      expect(result.errors).to.be.undefined;
    });
  });

  describe('deleteEvent()', () => {
    it('deletes event based on id and returns number of deleted items', async () => {
      const fakeData = {
        name: 'Test',
        startDate: Date.now(),
      }
      const Event = model('Event', eventSchema);
      const doc = await Event.create(fakeData);

      const result = await deleteEvent(doc.id);
      expect(result.deletedCount).to.equal(1);
    });

    it('returns zero deletion count when id is not found', async () => {
      const result = await deleteEvent('5f620394e465321e1e210fa0');
      expect(result.deletedCount).to.equal(0);
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
      const Event = model('Event', eventSchema);
      const doc = await Event.create(fakeData);

      const result = await updateEvent(doc.id, 'Test', '2020-10-24', '2020-10-26', 'Test desc 2');
      expect(result.errors).to.be.undefined;
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
      const Event = model('Event', eventSchema);
      await Event.create(fakeData);

      const result = await getUpcomingEvents();
      expect(result.length).to.equal(2);
    });
  })
});
