import { expect, use } from "chai";
import chaiExclude from 'chai-exclude';
import { EventModel } from "../graphql-data/models";
import { clearEventCache, disconnect, getEventCache, setEventCache } from './cache';

use(chaiExclude);

const fakeData: EventModel[] = [
  {
    _id: 'id',
    name: 'name',
    startDate: new Date(),
    endDate: new Date(),
  }
];

describe('cache.ts', () => {
  after(() => {
    disconnect();
  });

  it('getEventCache() returns null when no data exists', async () => {
    const result = await getEventCache();
    expect(result).to.be.null;
  });

  it('setEventCache() returns "OK"', async () => {
    const result = await setEventCache(fakeData, 10);
    expect(result).to.equal('OK');
  });

  it('getEventCache() returns array of events', async () => {
    const result = await getEventCache();
    expect(result).excluding(['startDate', 'endDate']).to.deep.equal(fakeData);
  });

  it('clearEventCache() returns number of deleted keys', async () => {
    const result = await clearEventCache();
    expect(result).to.equal(1);
  });
});
