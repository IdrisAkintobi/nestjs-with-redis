import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../../../../src/app.module';
import { RedisRepositoryInterface } from '../../../../src/domain/interface/redis.repository.interface';
import { RedisRepository } from '../../../../src/infrastructure/redis/repository/redis.repository';
import { mockRedis } from '../../../mocks/redis-mock';

describe('RedisRepository', () => {
    let testingModule: TestingModule;
    let redisRepository: RedisRepositoryInterface;

    beforeAll(async () => {
        testingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider('RedisClient')
            .useValue(mockRedis)
            .compile();

        redisRepository = testingModule.get<RedisRepository>(RedisRepository);
    });

    afterAll(async () => {
        jest.clearAllMocks();
        await testingModule.close();
    });

    it('should correctly get key', async () => {
        const prefix = 'prefix';
        const key = 'key';
        const value = 'value';
        mockRedis.get.mockResolvedValue(value);

        const result = await redisRepository.get(prefix, key);
        expect(result).toEqual(value);
        expect(mockRedis.get).toHaveBeenCalledTimes(1);
        expect(mockRedis.get).toHaveBeenCalledWith(`${prefix}:${key}`);
    });

    it('should correctly set key', async () => {
        const prefix = 'prefix';
        const key = 'key';
        const value = 'value';

        await redisRepository.set(prefix, key, value);
        expect(mockRedis.set).toHaveBeenCalledTimes(1);
        expect(mockRedis.set).toHaveBeenCalledWith(`${prefix}:${key}`, value);
    });

    it('should correctly delete key', async () => {
        const prefix = 'prefix';
        const key = 'key';

        await redisRepository.delete(prefix, key);
        expect(mockRedis.del).toHaveBeenCalledTimes(1);
        expect(mockRedis.del).toHaveBeenCalledWith(`${prefix}:${key}`);
    });

    it('should correctly set key with expiry', async () => {
        const prefix = 'prefix';
        const key = 'key';
        const value = 'value';

        await redisRepository.setWithExpiry(prefix, key, value, 100);
        expect(mockRedis.set).toHaveBeenCalledTimes(1);
        expect(mockRedis.set).toHaveBeenCalledWith(`${prefix}:${key}`, value, 'EX', 100);
    });
});
