import * as redis from 'redis';
import NotFoundError from '../../exceptions/NotFoundError';

export default class CacheService {
  private _client: redis.RedisClientType;

  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });

    this._client.on('error', (error) => {
      console.error(error);
    });

    this._client.connect();

    this.set = this.set.bind(this);
    this.get = this.get.bind(this);
    this.delete = this.delete.bind(this);
  }

  async set(key: string, value: string, expirationInSecond: number = 1800) {
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key: string) {
    const result = await this._client.get(key);

    if (!result) throw new NotFoundError('Cache not found');

    return result;
  }

  delete(key: string) {
    return this._client.del(key);
  }
}
