import { Inject, Injectable } from '@nestjs/common';
import { ResetTokenInterface } from '../domain/interface/reset.token.interface';
import { RedisService } from './redis.service';

@Injectable()
export class PasswordResetService {
    constructor(@Inject(RedisService) private readonly redisService: RedisService) {}

    async generateResetToken(userId: string): Promise<ResetTokenInterface> {
        //NOTE Check if the user exists in the database
        //Generate a random number token with the length of 6
        const token = Math.floor(100000 + Math.random() * 900000).toString();
        await this.redisService.saveResetToken(userId, token);
        return { token };
    }

    async getTokenUserId(token: string): Promise<string> {
        return await this.redisService.getResetToken(token);
    }
}
