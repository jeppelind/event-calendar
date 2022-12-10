import { EventModel } from '../graphql-data/models';
import { LocalCache } from './local';
import { RedisCache } from './redis';

var cache: LocalCache | RedisCache;
if (process.env.CACHE_PROVIDER === 'local') {
  cache = new LocalCache();
} else {
  cache = new RedisCache();
}

export const getEventCache = async () => {
  const events = await cache.get();
  return events;
}

export const setEventCache = async (events: EventModel[]) => {
  const result = await cache.set(events);
  return result;
}

export const clearEventCache = async () => {
  const result = cache.clear();
  return result;
}
