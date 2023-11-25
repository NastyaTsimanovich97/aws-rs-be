import { DynamoDBClient, TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ apiVersion: '2012-08-10' });
const docClient = DynamoDBDocumentClient.from(client);

import { buildResponseBody } from '../../../utils/buildResponseBody.util';

export const handler = async function(event: any) {
  console.log(`event: ${event}`);
  
  try {
    const method = event.httpMethod;
    const body = event.body;

    console.log(`method: ${method}`);
    console.log(`productData: ${body}`);

    const productData = JSON.parse(body);

    const input = {
      TransactItems: [
        {
          Put: {
            Item: {
              'id': { S: productData.id },
              'title': { S: productData.title },
              'description': { S: productData.description },
              'price': { N: `${productData.price}` },
            },
            TableName: process.env.PRODUCTS_TABLE,
          },
        },
        {
          Put: {
            Item: {
              'product_id':{ S: productData.id },
              'count': { N: `${productData.count}` }
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

    return buildResponseBody(200, JSON.stringify(productData));
  } catch(error: any) {
    const body = error.stack || JSON.stringify(error, null, 2);

    return buildResponseBody(500, body);
  }
}
