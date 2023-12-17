import { Construct } from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import * as path from 'path';
import 'dotenv/config';

export class AuthService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const basicAuthorizerHandler = new NodejsFunction(this, 'basicAuthorizerHandler', {
      memorySize: 1024,
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: path.join(__dirname, `./lambdas/basicAuthorizer/index.ts`),
      handler: 'handler',
      environment: {
        NastyaTsimanovich97: process.env.NastyaTsimanovich97!,
      }
    });
  }
}
