import Redis from 'ioredis';
import { EventModel } from '../graphql-data/models';

export class RedisCache {
  private _redis: Redis.Redis;

  constructor() {
    this._redis = new Redis({
      host: process.env.REDIS_HOST
    });
  }

  public disconnect() {
    this._redis.disconnect(false);
  }

  public async get() {
    try {
      const data = await this._redis.get('upcoming-events');
      const parsedData: EventModel[] = JSON.parse(data) || [];
      return parsedData;
    } catch (err) {
      console.error(err);
    }
  }

  public async set(events: EventModel[],  expiration?: number) {
    try {
      const result = await this._redis.set('upcoming-events', JSON.stringify(events));
      const cacheExpiration = expiration || parseInt(process.env.CACHE_EXPIRATION);
      await this._redis.expire('upcoming-events', cacheExpiration);
      return result;
    } catch (err) {
      console.error(err);
    }
  }

  public clear() {
    const result = this._redis.del('upcoming-events');
    return result;
  }
}
