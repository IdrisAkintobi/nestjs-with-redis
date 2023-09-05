import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import * as request from 'supertest';
import { ProductController } from '../../src/controller/product.controller';
import { ProductService } from '../../src/service/product.service';
import { productData } from '../mocks/productData.mock';

describe('ProductController (e2e)', () => {
    let app: INestApplication;
    const productServiceMock: MockProxy<ProductService> = mock();

    beforeAll(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [
                {
                    provide: ProductService,
                    useValue: productServiceMock,
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

    describe('GET /products/:productId', () => {
        const route = '/products';

        it('should return a product', async () => {
            const productId = 1;
            productServiceMock.getProduct.mockResolvedValueOnce(productData);

            const response = await request(app.getHttpServer()).get(`${route}/${productId}`);
            expect(response.status).toBe(200);
            expect(response.body.data).toEqual(productData);
        });

        it('should return a 400 if productId is not in range [1, 10]', async () => {
            const productId = 11;

            const response = await request(app.getHttpServer()).get(`${route}/${productId}`);
            expect(response.status).toBe(400);
            expect(response.body.message).toEqual(['productId must be between 1 - 10']);
        });
    });
});
