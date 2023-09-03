import { Module } from '@nestjs/common';

import { RedisService } from '../../application/redis.service';
import { redisClientFactory } from './redis.client.factory';
import { RedisRepository } from './repository/redis.repository';

@Module({
    imports: [],
    controllers: [],
    providers: [redisClientFactory, RedisRepository, RedisService],

    exports: [RedisService],
})
export class RedisModule {}
