import { PRODUCTS } from '../../../../constants/products';

import { buildResponseBody } from '../../../../utils/buildResponseBody.util';

export const handler = async function(event: any) {
  try {
    const method = event.httpMethod;
    const productId = event.pathParameters.productId;

    if (method === "GET") {
      const product = PRODUCTS.find(item => item.id === productId);

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
