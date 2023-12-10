import { v4 as uuid } from 'uuid';
import { DynamoDBClient, TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

import { buildResponseBody } from '../../../../utils/buildResponseBody.util';

const client = new DynamoDBClient({ apiVersion: '2012-08-10' });
const docClient = DynamoDBDocumentClient.from(client);

const snsClient = new SNSClient();

export const handler = async function(event: any) {
  console.log(`event: ${event}`);

  const items = event.Records;

  console.log('items', items);
  
  try {
    for (const { body } of items) {
      const product = JSON.parse(body);
      const productId = product.id || uuid();

      const input = {
        TransactItems: [
          {
            Put: {
              Item: {
                'id': { S: productId },
                'title': { S: product.title },
                'description': { S: product.description },
                'price': { N: `${product.price}` },
              },
              TableName: process.env.PRODUCTS_TABLE,
            },
          },
          {
            Put: {
              Item: {
                'product_id':{ S: productId },
                'count': { N: `${product.count}` }
              },
              TableName: process.env.STOCKS_TABLE,
            },
          },
        ],
        ReturnConsumedCapacity: 'TOTAL',
      };

      const command = new TransactWriteItemsCommand(input as any);
      const response = await docClient.send(command);

      console.log(`productData response: ${JSON.stringify(response)}`);      
    }

    const publishResult = await snsClient.send(
      new PublishCommand({
        TopicArn: process.env.CREATE_PRODUCT_TOPIC,
        Message: 'Products are added successfully.',
      }),
    );

    console.log('send message to topic', publishResult);

    return buildResponseBody(200, 'send');
  } catch(error: any) {
    const body = error.stack || JSON.stringify(error, null, 2);

    console.log('error', error);

    return buildResponseBody(500, body);
  }
}
