import { Test, TestingModule } from '@nestjs/testing';

import { PasswordResetService } from '../../../src/service/password-reset.service';
import { RedisService } from '../../../src/service/redis.service';
import { mockedRedisService } from '../../mocks/redis-service-mock';

describe('PasswordResetService', () => {
    let testingModule: TestingModule;
    let passwordResetService: PasswordResetService;

    const token = '123456';
    const userId = 'userId';

    //mock Math.floor
    jest.spyOn(Math, 'floor').mockReturnValue(+token);

    beforeAll(async () => {
        testingModule = await Test.createTestingModule({
            providers: [
                PasswordResetService,
                {
                    provide: RedisService,
                    useValue: mockedRedisService,
                },
            ],
        }).compile();

        passwordResetService = testingModule.get<PasswordResetService>(PasswordResetService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await testingModule.close();
    });

    it('should successfully generate password reset token', async () => {
        const result = await passwordResetService.generateResetToken(userId);
        expect(result).toEqual({ token });
        expect(mockedRedisService.saveResetToken).toHaveBeenCalledTimes(1);
        expect(mockedRedisService.saveResetToken).toHaveBeenCalledWith(userId, token);
    });

    it('should successfully get token user id', async () => {
        mockedRedisService.getResetToken.mockResolvedValue(userId);
        const result = await passwordResetService.getTokenUserId(token);
        expect(result).toEqual(userId);
        expect(mockedRedisService.getResetToken).toHaveBeenCalledTimes(1);
        expect(mockedRedisService.getResetToken).toHaveBeenCalledWith(token);
    });
});
