import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { QueryCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ apiVersion: '2012-08-10' });
const docClient = DynamoDBDocumentClient.from(client);

import { buildResponseBody } from '../../../../utils/buildResponseBody.util';

export const handler = async function(event: any) {
  console.log(`event: ${event}`);
  
  try {
    const method = event.httpMethod;
    const productId = event.pathParameters.productId;

    const productFields = 'id, title, description, price';
    const stockFields = 'product_id, #c';

    if (method === 'GET') {
      const commandProduct = new QueryCommand({
        TableName: process.env.PRODUCTS_TABLE,
        ProjectionExpression: productFields,
        KeyConditionExpression: 'id = :product_id',
        ExpressionAttributeValues: {
          ':product_id': productId,
        },
        ConsistentRead: true,
      });

      const commandStock = new QueryCommand({
        TableName: process.env.STOCKS_TABLE,
        ProjectionExpression: stockFields,
        ExpressionAttributeNames: { '#c': 'count' },
        KeyConditionExpression: 'product_id = :product_id',
        ExpressionAttributeValues: {
          ':product_id': productId,
        },
        ConsistentRead: true,
      });

      const { Items: products } = await docClient.send(commandProduct);

      console.log(`products: ${JSON.stringify(products)}`);
  
      const { Items: stocks } = await docClient.send(commandStock);

      console.log(`stocks: ${JSON.stringify(stocks)}`);

      const stock = stocks?.[0];
      const product = {
        ...(products?.[0] || {}),
        count: stock?.count
      };

      console.log(`product: ${JSON.stringify(product)}`);

      if (product) {
        return buildResponseBody(200, JSON.stringify(product));
      }

      return buildResponseBody(400, 'Product not found');
    }

    return buildResponseBody(400, 'We only accept GET not ' + method);
  } catch(error: any) {
    const body = error.stack || JSON.stringify(error, null, 2);

    return buildResponseBody(500, body);
  }
}
