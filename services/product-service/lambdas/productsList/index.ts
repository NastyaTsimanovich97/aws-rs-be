import { PRODUCTS } from '../../../../constants/products';

import { buildResponseBody } from '../../../../utils/buildResponseBody.util';

export const handler = async function(event: any) {
  try {
    const method = event.httpMethod;
    const path = event.path;

    if (method === "GET") {
      if (path === "/products") {
        return buildResponseBody(200, JSON.stringify(PRODUCTS));
      }
    }

    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
      },
      body: 'We only accept GET not ' + method,
    };
  } catch(error: any) {
    const body = error.stack || JSON.stringify(error, null, 2);

    return buildResponseBody(400, body);
  }
}
