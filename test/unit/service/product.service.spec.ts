import { Test, TestingModule } from '@nestjs/testing';

import { ProductService } from '../../../src/service/product.service';
import { RedisService } from '../../../src/service/redis.service';
import { productData } from '../../mocks/productData.mock';
import { mockedRedisService } from '../../mocks/redis-service-mock';

describe('ProductService', () => {
    let testingModule: TestingModule;
    let productService: ProductService;

    const productURL = 'https://dummyjson.com/products';
    const productId = '1';

    //mock fetch
    const mockFetchPromise = Promise.resolve({
        json: () => Promise.resolve(productData),
        ok: true,
    });
    const mockFetch = jest.spyOn(global, 'fetch') as jest.Mock;
    mockFetch.mockImplementation(() => mockFetchPromise);

    beforeAll(async () => {
        testingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                {
                    provide: RedisService,
                    useValue: mockedRedisService,
                },
            ],
        }).compile();

        productService = testingModule.get<ProductService>(ProductService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await testingModule.close();
    });

    it('should successfully get product from API', async () => {
        mockedRedisService.getProduct.mockReturnValue(null);
        await productService.getProduct(productId);
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledWith(`${productURL}/${productId}`);
        expect(mockedRedisService.getProduct).toHaveBeenCalledTimes(1);
        expect(mockedRedisService.getProduct).toHaveBeenCalledWith(productId);
    });

    it('should successfully get product from cache', async () => {
        mockedRedisService.getProduct.mockReturnValue(productData);
        const result = await productService.getProduct(productId);
        expect(result).toEqual({ data: productData });
        expect(mockFetch).toHaveBeenCalledTimes(0);
        expect(mockedRedisService.getProduct).toHaveBeenCalledTimes(1);
        expect(mockedRedisService.getProduct).toHaveBeenCalledWith(productId);
    });

    it('should throw if fetch fails', async () => {
        mockedRedisService.getProduct.mockReturnValue(null);
        mockFetch.mockImplementationOnce(() => Promise.reject(new Error('error')));
        await expect(productService.getProduct(productId)).rejects.toThrow('error');
    });

    it('should throw if fetch.ok is false', async () => {
        mockedRedisService.getProduct.mockReturnValue(null);
        mockFetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
            }),
        );
        await expect(productService.getProduct(productId)).rejects.toThrow('Something went wrong');
    });
});
