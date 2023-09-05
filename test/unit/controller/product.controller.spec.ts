import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import { ProductController } from '../../../src/controller/product.controller';
import { ProductService } from '../../../src/service/product.service';
import { productData } from '../../mocks/productData.mock';

describe('ProductController', () => {
    let testingModule: TestingModule;
    let productController: ProductController;
    const productServiceMock: MockProxy<ProductService> = mock();

    beforeAll(async () => {
        testingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [
                {
                    provide: ProductService,
                    useValue: productServiceMock,
                },
            ],
        }).compile();

        productController = testingModule.get<ProductController>(ProductController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await testingModule.close();
    });

    it('should successfully get product', async () => {
        const productId = '1';
        productServiceMock.getProduct.mockResolvedValueOnce(productData);
        const { data } = await productController.getProduct({ productId });
        expect(productServiceMock.getProduct).toHaveBeenCalledTimes(1);
        expect(productServiceMock.getProduct).toHaveBeenCalledWith(productId);
        expect(data).toEqual(productData);
    });
});
