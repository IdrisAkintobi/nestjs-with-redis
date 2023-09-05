import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import { PasswordResetController } from '../../../src/controller/password-reset.controller';
import { PasswordResetService } from '../../../src/service/password-reset.service';

describe('PasswordResetController', () => {
    let testingModule: TestingModule;
    let passwordResetController: PasswordResetController;
    const passwordResetServiceMock: MockProxy<PasswordResetService> = mock();

    beforeAll(async () => {
        testingModule = await Test.createTestingModule({
            controllers: [PasswordResetController],
            providers: [
                {
                    provide: PasswordResetService,
                    useValue: passwordResetServiceMock,
                },
            ],
        }).compile();

        passwordResetController =
            testingModule.get<PasswordResetController>(PasswordResetController);
    });

    afterAll(async () => {
        await testingModule.close();
    });

    const token = '123456';
    const userId = 'userId';
    const password = 'password';

    it('should successfully generate password reset token', async () => {
        passwordResetServiceMock.generateResetToken.mockResolvedValueOnce({ token });
        const { data } = await passwordResetController.generateToken({ userId });
        expect(passwordResetServiceMock.generateResetToken).toHaveBeenCalledTimes(1);
        expect(passwordResetServiceMock.generateResetToken).toHaveBeenCalledWith(userId);
        expect(data).toEqual({ token });
    });

    it('should successfully update password', async () => {
        passwordResetServiceMock.getTokenUserId.mockResolvedValueOnce(userId);
        await passwordResetController.updatePassword({ token, userId, password });
        expect(passwordResetServiceMock.getTokenUserId).toHaveBeenCalledTimes(1);
        expect(passwordResetServiceMock.getTokenUserId).toHaveBeenCalledWith(token);
    });

    it('should throw if token is invalid', async () => {
        passwordResetServiceMock.getTokenUserId.mockResolvedValueOnce(null);
        await expect(
            passwordResetController.updatePassword({ token, userId, password }),
        ).rejects.toThrow('Invalid token');
    });
});
