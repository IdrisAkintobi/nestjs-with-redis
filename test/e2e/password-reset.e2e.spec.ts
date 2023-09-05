import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import * as request from 'supertest';
import { PasswordResetController } from '../../src/controller/password-reset.controller';
import { PasswordResetService } from '../../src/service/password-reset.service';

describe('PasswordResetController (e2e)', () => {
    let app: INestApplication;
    const passwordResetServiceMock: MockProxy<PasswordResetService> = mock();

    beforeAll(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            controllers: [PasswordResetController],
            providers: [
                {
                    provide: PasswordResetService,
                    useValue: passwordResetServiceMock,
                },
            ],
        }).compile();

        app = testingModule.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true }));

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /reset-password/generate-token', () => {
        const route = '/reset-password/generate-token';

        const tokenData = { token: 'token' };

        it('should return a token', async () => {
            passwordResetServiceMock.generateResetToken.mockResolvedValueOnce(tokenData);

            const response = await request(app.getHttpServer()).post(route).send({ userId: '1' });
            expect(response.status).toBe(201);
            expect(response.body.data).toEqual(tokenData);
        });

        // it fails if userId is not passed or userId is empty or userId is not a string
        it.each`
            userId
            ${undefined}
            ${''}
            ${1}
        `('should return a 400 if userId is $userId', async ({ userId }) => {
            const response = await request(app.getHttpServer()).post(route).send({ userId });
            expect(response.status).toBe(400);
        });
    });
});
