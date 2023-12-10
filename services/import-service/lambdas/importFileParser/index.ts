import { v4 as uuid } from 'uuid';
import { Readable } from 'node:stream';

import { S3Client, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

import { SQSClient, SendMessageBatchCommand } from '@aws-sdk/client-sqs';

import { buildResponseBody } from '../../../../utils/buildResponseBody.util';
import { parseProducts } from '../../utils/parseProducts';

const client = new S3Client();
const sqsClient = new SQSClient();

export const handler = async function(event: any) {
  console.log(`event:`, event);

  const file = event.Records?.[0]?.s3?.object;
  console.log('file', file);
  
  const fileName = file?.key;
  console.log('fileName', fileName);
  
  try {
    const getCommand = new GetObjectCommand({
      Bucket: process.env.UPLOAD_BUCKET,
      Key: fileName,
    });

    const { Body: s3File } = await client.send(getCommand);

    const results = await parseProducts(s3File as Readable);

    const sqsInput = {
      Entries: results.map((item) => ({
        Id: uuid(),
        MessageBody: JSON.stringify(item),
      })),
      QueueUrl: process.env.CATALOG_QUEUE
    };

    const sqsCommand = new SendMessageBatchCommand(sqsInput);

    const sqsResponse = await sqsClient.send(sqsCommand);
    console.log('sqsResponse', sqsResponse);

    const copyCommand = new CopyObjectCommand({
      CopySource: `${process.env.UPLOAD_BUCKET}/${fileName}`,
      Bucket: process.env.UPLOAD_BUCKET,
      Key: `parsed/${fileName.split('uploaded/')[1]}`,
    });

    const copyResponse = await client.send(copyCommand);
    console.log('copyResponse', copyResponse);

    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.UPLOAD_BUCKET,
      Key: fileName,
    });

    const deleteResponse = await client.send(deleteCommand);
    console.log('deleteResponse', deleteResponse);

    return buildResponseBody(200, 'File are parsed and moved to /parsed folder');
  } catch(error: any) {
    const body = error.stack || JSON.stringify(error, null, 2);

    console.log('error', error);

    return buildResponseBody(500, body);
  }
}
