import Redis from 'ioredis';
import { EventModel } from '../graphql-data/models';

const redis = new Redis({
  host: process.env.REDIS_HOST
});

export const disconnect = () => {
  redis.disconnect(false);
}

export const getEventCache = async () => {
  try {
    const data = await redis.get('upcoming-events');
    const parsedData: EventModel[] = JSON.parse(data);
    return parsedData;
  } catch (err) {
    console.error(err);
  }
}

export const setEventCache = async (events: EventModel[], expiration?: number) => {
  try {
    const result = await redis.set('upcoming-events', JSON.stringify(events));
    const cacheExpiration = expiration || parseInt(process.env.CACHE_EXPIRATION);
    await redis.expire('upcoming-events', cacheExpiration);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export const clearEventCache = async () => {
  const result = redis.del('upcoming-events');
  return result;
}
