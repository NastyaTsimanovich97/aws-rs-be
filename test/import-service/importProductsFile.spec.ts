import { handler } from '../../services/import-service/lambdas/importProductsFile';

jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn().mockImplementation(() => {
      return {
        send: jest
          .fn()
          .mockImplementationOnce(() => Promise.resolve({}))
      };
    }),
    PutObjectCommand: class {},
  };
});

jest.mock('@aws-sdk/s3-request-presigner', () => {
  return {
    getSignedUrl: jest.fn().mockImplementation(() => 'url'),
  };
});

describe('importProductsFile', () => {
  describe ('GET', () => {
    it('should return Signed URL', async () => {
      const event = {
        queryStringParameters: {
          name: 'file.csv',
        },
      };

      const result = await handler(event);

      expect(result.body).toStrictEqual('url');
    });
  });
});
