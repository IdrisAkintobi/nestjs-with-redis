import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { AppModule } from '../../../src/app.module';
import { RedisService } from '../../../src/application/redis.service';
import { RedisPrefixEnum } from '../../../src/domain/enum/redis-prefix-enum';
import { RedisRepository } from '../../../src/infrastructure/redis/repository/redis.repository';
import { productData } from '../../mocks/productData.mock';
import { mockRedis } from '../../mocks/redis-mock';

const oneDayInSeconds = 60 * 60 * 24;
const tenMinutesInSeconds = 60 * 10;

describe('RedisService', () => {
    let testingModule: TestingModule;
    let redisService: RedisService;

    const redisRepositoryMock: MockProxy<RedisRepository> = mock();

    beforeAll(async () => {
        testingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider('RedisClient')
            .useValue(mockRedis)
            .overrideProvider(RedisRepository)
            .useValue(redisRepositoryMock)
            .compile();

        testingModule.createNestApplication();

        redisService = testingModule.get<RedisService>(RedisService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await testingModule.close();
    });

    it('should successfully save product', async () => {
        const productId = 'product-id';
        await redisService.saveProduct(productId, productData);
        expect(redisRepositoryMock.setWithExpiry).toHaveBeenCalledTimes(1);
        expect(redisRepositoryMock.setWithExpiry).toHaveBeenCalledWith(
            RedisPrefixEnum.PRODUCT,
            productId,
            JSON.stringify(productData),
            oneDayInSeconds,
        );
    });

    it('should successfully get product', async () => {
        const productId = 'product-id';
        redisRepositoryMock.get.mockResolvedValue(JSON.stringify(productData));
        const result = await redisService.getProduct(productId);
        expect(result).toEqual(productData);
        expect(redisRepositoryMock.get).toHaveBeenCalledTimes(1);
        expect(redisRepositoryMock.get).toHaveBeenCalledWith(RedisPrefixEnum.PRODUCT, productId);
    });

    it('should successfully save reset token', async () => {
        const userId = 'user-id';
        const token = 'token';
        await redisService.saveResetToken(userId, token);
        expect(redisRepositoryMock.setWithExpiry).toHaveBeenCalledTimes(1);
        expect(redisRepositoryMock.setWithExpiry).toHaveBeenCalledWith(
            RedisPrefixEnum.RESET_TOKEN,
            token,
            userId,
            tenMinutesInSeconds,
        );
    });

    it('should successfully get reset token', async () => {
        const userId = 'user-id';
        const token = 'token';
        redisRepositoryMock.get.mockResolvedValue(userId);
        const result = await redisService.getResetToken(token);
        expect(result).toEqual(userId);
        expect(redisRepositoryMock.get).toHaveBeenCalledTimes(1);
        expect(redisRepositoryMock.get).toHaveBeenCalledWith(RedisPrefixEnum.RESET_TOKEN, token);
    });
});
