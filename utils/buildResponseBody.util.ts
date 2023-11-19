export const buildResponseBody = (status: number, body: unknown, headers = {}) => {
  return {
    statusCode: status,
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      ...headers,
    },
    body,
  };
};
