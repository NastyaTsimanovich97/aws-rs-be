export function buildAuthResponse(Effect: 'Allow' | 'Deny', Resource: string) {
  return {
    principalId: 'user',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect,
          Resource,
        },
      ],
    },
  };
}
