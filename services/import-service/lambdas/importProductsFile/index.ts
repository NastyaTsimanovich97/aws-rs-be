import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { buildResponseBody } from '../../../../utils/buildResponseBody.util';

const client = new S3Client();

export const handler = async function(event: any) {
  console.log(`event: ${event}`);

  const name = event.queryStringParameters?.name;
  
  try {
    // Get signed URL from S3
    const putObjectParams = {
      Bucket: process.env.UPLOAD_BUCKET,
      Key: `uploaded/${name}`,
      ContentType: 'application/json',
    };

    const command = new PutObjectCommand(putObjectParams);

    const signedUrl = await getSignedUrl(client, command);

    return buildResponseBody(200, signedUrl);
  } catch(error: any) {
    const body = error.stack || JSON.stringify(error, null, 2);

    return buildResponseBody(500, body);
  }
}
