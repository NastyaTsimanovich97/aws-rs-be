import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ScanCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import { buildResponseBody } from '../../../utils/buildResponseBody.util';

const client = new DynamoDBClient({ apiVersion: '2012-08-10' });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async function(event: any) {
  console.log(`event: ${event}`);
  
  try {
    const method = event.httpMethod;
    const path = event.path;

    const productFields = 'id, title, description, price';
    const stockFields = 'product_id, #c';

    if (method === 'GET') {
      if (path === '/products') {
        // BatchGetItem
        const commandProduct = new ScanCommand({
          TableName: process.env.PRODUCTS_TABLE,
          ProjectionExpression: productFields,
        });

        const commandStock = new ScanCommand({
          TableName: process.env.STOCKS_TABLE,
          ProjectionExpression: stockFields,
          ExpressionAttributeNames: { '#c': 'count' }
        });

        const { Items: products } = await docClient.send(commandProduct);

        console.log(`products: ${JSON.stringify(products)}`);
    
        const { Items: stocks } = await docClient.send(commandStock);

        console.log(`stocks: ${JSON.stringify(stocks)}`);

        const productsWithStocks = products?.map((item) => {
          const stock = stocks?.find(stockItem => stockItem.product_id === item.id);

          return {
            ...item,
            count: stock?.count || 0,
          }
        });

        console.log(`products with stocks: ${JSON.stringify(productsWithStocks)}`);

        return buildResponseBody(200, JSON.stringify(productsWithStocks));
      }
    }

    return buildResponseBody(400, 'We only accept GET not ' + method);
  } catch(error: any) {
    const body = error.stack || JSON.stringify(error, null, 2);

    return buildResponseBody(500, body);
  }
}
