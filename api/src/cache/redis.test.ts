import { expect, use } from "chai";
import chaiExclude from 'chai-exclude';
import { EventModel } from "../graphql-data/models";
import { RedisCache } from "./redis";

use(chaiExclude);

const fakeData: EventModel[] = [
  {
    _id: 'id',
    name: 'name',
    startDate: new Date(),
    endDate: new Date(),
  }
];

describe('redis.ts', () => {
  const redisCache = new RedisCache();

  after(() => {
    redisCache.disconnect();
  });

  it('get() returns empty array when no data exists', async () => {
    const result = await redisCache.get();
    expect(result.length).to.equal(0);
  });

  it('set() returns "OK"', async () => {
    const result = await redisCache.set(fakeData);
    expect(result).to.equal('OK');
  });

  it('get() returns array of events', async () => {
    const result = await redisCache.get();
    expect(result).excluding(['startDate', 'endDate']).to.deep.equal(fakeData);
  });

  it('clear() returns number of deleted keys', async () => {
    const result = await redisCache.clear();
    expect(result).to.equal(1);
  });
});
