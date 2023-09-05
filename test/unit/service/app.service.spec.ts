import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '../../../src/service/app.service';

describe('AppService', () => {
    let appService: AppService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            providers: [AppService],
        }).compile();

        appService = app.get<AppService>(AppService);
    });

    describe('getHello', () => {
        it('should return "Hello World!"', () => {
            expect(appService.getHello()).toBe('Hello World!');
        });
    });
});
