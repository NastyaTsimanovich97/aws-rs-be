import { PRODUCTS } from '../../constants/products';

import { handler } from '../../services/product-service/lambdas/getProductsList';

describe('getProductsList', () => {
  describe ('GET', () => {
    it('should return products', async () => {
      const event = {
        httpMethod: 'GET',
        path: '/products',
      };

      const response = PRODUCTS;

      const result = await handler(event);

      expect(result.body).toStrictEqual(JSON.stringify(response));
    });

    it('should return 400 error', async () => {
      const event = {
        httpMethod: 'POST',
      };

      const result = await handler(event);

      expect(result.statusCode).toStrictEqual(400);
    });
  });
});
