import { parse } from 'csv-parse';
import { Readable } from 'node:stream';
import { S3Client, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

import { buildResponseBody } from '../../../../utils/buildResponseBody.util';
const client = new S3Client();

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

    const parser = (s3File as Readable)?.pipe(
      parse({
        delimiter: ',',
        columns: false,
        cast: (value: string, context) => {
          console.log('context', context);
          console.log('value', value);

          return value;
        },
      }),
    );

    const results = [];

    for await (const item of parser) {
      console.log(`item ${JSON.stringify(item)}`);
      results.push(item.data);
    }

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
  } catch(error: any) {
    const body = error.stack || JSON.stringify(error, null, 2);

    console.log('error', error);

    return buildResponseBody(500, body);
  }
}
