import { Construct } from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import * as s3n from '@aws-cdk/aws-s3-notifications';
import * as path from 'path';

export class ImportService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const importBucket = s3.Bucket.fromBucketName(
      this,
      'tsimanovich-import',
      'tsimanovich-import',
    );

    // Import Products File
    const importProductsFileBucket = new s3.Bucket(this, 'ImportProductsFile');

    const importProductsFileHandler = new NodejsFunction(this, 'importProductsFileHandler', {
      memorySize: 1024,
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: path.join(__dirname, `./lambdas/importProductsFile/index.ts`),
      handler: 'handler',
      environment: {
        BUCKET: importProductsFileBucket.bucketName,
        UPLOAD_BUCKET: importBucket.bucketName,
      }
    });

    importProductsFileBucket.grantReadWrite(importProductsFileHandler);
    importBucket.grantReadWrite(importProductsFileHandler);

    // Import Products File
    const importFileParserBucket = new s3.Bucket(this, 'ImportFileParser');

    const importFileParserHandler = new NodejsFunction(this, 'importFileParserHandler', {
      memorySize: 1024,
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: path.join(__dirname, `./lambdas/importFileParser/index.ts`),
      handler: 'handler',
      environment: {
        BUCKET: importFileParserBucket.bucketName,
        UPLOAD_BUCKET: importBucket.bucketName,
      }
    });

    importFileParserBucket.grantReadWrite(importFileParserHandler);
    importBucket.grantReadWrite(importFileParserHandler);
    importBucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(importFileParserHandler),
      { prefix: 'uploaded' }
    );

    // Imports API
    const api = new apigateway.RestApi(this, 'import-api', {
      restApiName: 'import',
      description: 'This service import files.',
      defaultCorsPreflightOptions: {
        allowHeaders: ['Content-Type'],
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
      },
    });

    const importApi = api.root.addResource('import');

    const importProductsFileIntegration = new apigateway.LambdaIntegration(importProductsFileHandler, {
      requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
    });

    importApi.addMethod('GET', importProductsFileIntegration);
  }
}
