import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

import { RedisRepositoryInterface } from '../../../domain/interface/redis.repository.interface';

@Injectable()
export class RedisRepository implements OnModuleDestroy, RedisRepositoryInterface {
    public constructor(@Inject('RedisClient') private readonly redisClient: Redis) {}

    onModuleDestroy(): void {
        this.redisClient.disconnect();
    }

    public async get(prefix: string, key: string): Promise<string | null> {
        return this.redisClient.get(`${prefix}:${key}`);
    }

    public async set(prefix: string, key: string, value: string): Promise<void> {
        await this.redisClient.set(`${prefix}:${key}`, value);
    }

    public async delete(prefix: string, key: string): Promise<void> {
        await this.redisClient.del(`${prefix}:${key}`);
    }

    public async setWithExpiry(
        prefix: string,
        key: string,
        value: string,
        expiry: number,
    ): Promise<void> {
        await this.redisClient.set(`${prefix}:${key}`, value, 'EX', expiry);
    }
}
