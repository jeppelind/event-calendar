import { expect, use } from "chai";
import chaiExclude from 'chai-exclude';
import { EventModel } from "../graphql-data/models";
import { LocalCache } from "./local";

use(chaiExclude);

const fakeData: EventModel[] = [
  {
    _id: 'id',
    name: 'name',
    startDate: new Date(),
    endDate: new Date(),
  }
];

describe('local.ts', () => {
  const cache = new LocalCache();

  it('get() returns empty array when no data exists', () => {
    const result = cache.get();
    expect(result.length).to.equal(0);
  });

  it('set() returns undefined', () => {
    const result = cache.set(fakeData);
    expect(result).to.equal(undefined);
  });

  it('get() returns array of events', () => {
    const result = cache.get();
    expect(result).excluding(['startDate', 'endDate']).to.deep.equal(fakeData);
  });

  it('clear() returns undefined', () => {
    const result = cache.clear();
    expect(result).to.equal(undefined);
  });
});
