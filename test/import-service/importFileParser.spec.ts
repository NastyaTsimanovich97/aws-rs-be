import { handler } from '../../services/import-service/lambdas/importFileParser';

jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn().mockImplementation(() => {
      return {
        send: jest
          .fn()
          .mockImplementationOnce(() => Promise.resolve({
            Body: {
              pipe: jest.fn().mockImplementationOnce(() => [])
            }
          }))
          .mockImplementationOnce(() => Promise.resolve({}))
          .mockImplementationOnce(() => Promise.resolve({}))
      };
    }),
    GetObjectCommand: class {},
    CopyObjectCommand: class {},
    DeleteObjectCommand: class {},
  };
});

jest.mock('@aws-sdk/client-sqs', () => {
  return {
    SQSClient: jest.fn().mockImplementation(() => {
      return {
        send: jest
          .fn()
          .mockImplementationOnce(() => Promise.resolve({
            Body: {
              pipe: jest.fn().mockImplementationOnce(() => [])
            }
          }))
      };
    }),
    SendMessageBatchCommand: class {},
  };
});

jest.mock('csv-parse', () => {
  return {
    parse: jest.fn().mockImplementation(() => []),
  };
});

describe('importFileParser', () => {
  describe ('s3:event', () => {
    it('should return Signed URL', async () => {
      const event = {
        Records: [
          {
            s3: {
              object: {
                key: 'test.csv'
              }
            }
          }
        ]
      };

      const result = await handler(event);

      expect(result.statusCode).toStrictEqual(200);
    });
  });
});
