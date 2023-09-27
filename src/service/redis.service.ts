import { Inject, Injectable } from '@nestjs/common';

import { RedisPrefixEnum } from '../domain/enum/redis-prefix-enum';
import { ProductInterface } from '../domain/interface/product.interface';
import { RedisRepository } from '../infrastructure/redis/repository/redis.repository';

const oneDayInSeconds = 60 * 60 * 24;
const tenMinutesInSeconds = 60 * 10;

@Injectable()
export class RedisService {
    constructor(@Inject(RedisRepository) private readonly redisRepository: RedisRepository) {}

    async saveProduct(productId: string, productData: ProductInterface): Promise<void> {
        // Expiry is set to 1 day
        await this.redisRepository.setWithExpiry(
            RedisPrefixEnum.PRODUCT,
            productId,
            JSON.stringify(productData),
            oneDayInSeconds,
        );
    }

    async getProduct(productId: string): Promise<ProductInterface | null> {
        const product = await this.redisRepository.get(RedisPrefixEnum.PRODUCT, productId);
        return JSON.parse(product);
    }

    async saveResetToken(userId: string, token: string): Promise<void> {
        // Expiry is set to 10 minutes
        await this.redisRepository.setWithExpiry(
            RedisPrefixEnum.RESET_TOKEN,
            token,
            userId,
            tenMinutesInSeconds,
        );
    }

    async getResetToken(token: string): Promise<string | null> {
        return await this.redisRepository.get(RedisPrefixEnum.RESET_TOKEN, token);
    }
}
