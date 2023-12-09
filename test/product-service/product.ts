import { handler } from '../../services/product-service/lambdas/product';

describe('product', () => {
  describe ('GET', () => {
    it('should return product', async () => {
      const event = {
        httpMethod: 'GET',
        pathParameters: {
          productId: '00000000-0000-0000-0000-000000000000',
        },
      };

      const response = {
        id: '00000000-0000-0000-0000-000000000000',
        title: 'Before Sunrise',
        description: 'A young man and woman meet on a train in Europe, and wind up spending one evening together in Vienna. Unfortunately, both know that this will probably be their only night together. A young man and woman meet on a train in Europe, and wind up spending one evening together in Vienna.',
        price: 2
      };

      const result = await handler(event);

      expect(result.body).toStrictEqual(JSON.stringify(response));
    });

    it('should return 400 error', async () => {
      const event = {
        httpMethod: 'GET',
        pathParameters: {
          productId: '00000000-2222-2222-2222-000000000000',
        },
      };

      const result = await handler(event);

      expect(result.statusCode).toStrictEqual(400);
    });
  });
});
