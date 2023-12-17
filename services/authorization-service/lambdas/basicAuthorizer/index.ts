import { buildAuthResponse } from '../../utils/buildAuthResponse';

export const handler = async function(event: any) {
  console.log(`event:`, event);

  const token = event.authorizationToken?.split(' ').pop();

  if (!token || token === 'null' || token === 'undefined') {
    throw new Error('Unauthorized');
  }

  const buf = Buffer.from(token, 'base64');
  const [userName, pass] = buf.toString('utf-8').split(':');

  const envPassword = process.env?.[userName];

  const isAuth = pass === envPassword;

  return buildAuthResponse(isAuth ? 'Allow' : 'Deny', event.methodArn);
}
