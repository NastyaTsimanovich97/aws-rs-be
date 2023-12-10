import { TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb';
import { PublishCommand } from '@aws-sdk/client-sns';

import { handler } from '../../services/product-service/lambdas/catalogBatchProcess';

jest.mock('@aws-sdk/client-sns', () => {
  return {
    SNSClient: jest.fn().mockImplementation(() => {
      return {
        send: jest
          .fn()
          .mockImplementationOnce(() => Promise.resolve({}))
      };
    }),
    PublishCommand: jest.fn()
      .mockImplementationOnce(() => {
        throw new Error('Test Error');
      })
      .mockImplementation(() => {}),
  };
});

jest.mock('@aws-sdk/lib-dynamodb', () => {
  return {
    DynamoDBDocumentClient: {
      from: jest
        .fn()
        .mockImplementation(() => {
          return {
            send: jest
              .fn()
              .mockImplementationOnce(() => Promise.resolve({}))
          }
        }),
    }
  };
});

jest.mock('@aws-sdk/client-dynamodb', () => {
  return {
    DynamoDBClient: jest.fn().mockImplementation(() => {
      return {};
    }),
    TransactWriteItemsCommand: jest.fn().mockImplementation(),
  };
});

describe('catalogBatchProcess', () => {
  describe ('sqs:event', () => {
    it('should return 500 and error message', async () => {
      const event = {
        Records: [
          {
            body: JSON.stringify({
              title: 'Test',
              description: 'Test',
              price: 1,
              count: 0,
            })
          }
        ]
      };

      const result = await handler(event);

      expect(result.statusCode).toStrictEqual(500);
      expect(result.body).toContain('Test Error');
    });

    it('should return 200 and send response', async () => {
      const event = {
        Records: [
          {
            body: JSON.stringify({
              id: 'test',
              title: 'Test',
              description: 'Test',
              price: 1,
              count: 1,
            })
          }
        ]
      };

      const result = await handler(event);

      expect(result.statusCode).toStrictEqual(200);
      expect(result.body).toStrictEqual('send');

      expect(PublishCommand).toHaveBeenCalledWith({
        TopicArn: undefined,
        Message: 'Products are added successfully.',
      });

      expect(TransactWriteItemsCommand).toHaveBeenCalledWith({
        TransactItems: [
          {
            Put: {
              Item: {
                'id': { S: 'test' },
                'title': { S: 'Test' },
                'description': { S: 'Test' },
                'price': { N: '1' },
              },
              TableName: process.env.PRODUCTS_TABLE,
            },
          },
          {
            Put: {
              Item: {
                'product_id':{ S: 'test' },
                'count': { N: '1' }
              },
              TableName: process.env.STOCKS_TABLE,
            },
          },
        ],
        ReturnConsumedCapacity: 'TOTAL',
      });
    });
  });
});
