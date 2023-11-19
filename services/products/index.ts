import { Construct } from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import * as path from 'path';

export class ProductsService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Products List
    const listBucket = new s3.Bucket(this, 'ProductsList');

    const listHandler = new NodejsFunction(this, 'ProductsListHandler', {
      memorySize: 1024,
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: path.join(__dirname, `../../resources/lambdas/productsList/index.ts`),
      handler: 'handler',
      environment: {
        BUCKET: listBucket.bucketName
      }
    });

    listBucket.grantReadWrite(listHandler);

    // Product
    const productBucket = new s3.Bucket(this, 'Product');

    const productHandler = new NodejsFunction(this, 'ProductHandler', {
      memorySize: 1024,
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: path.join(__dirname, `../../resources/lambdas/product/index.ts`),
      handler: 'handler',
      environment: {
        BUCKET: productBucket.bucketName
      }
    });

    productBucket.grantReadWrite(productHandler);

    // Products API
    const api = new apigateway.RestApi(this, 'products-api', {
      restApiName: 'products',
      description: 'This service return products.',
      defaultCorsPreflightOptions: {
        allowHeaders: ['Content-Type'],
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
      },
    });

    const productsListIntegration = new apigateway.LambdaIntegration(listHandler, {
      requestTemplates: { 'application/json': '{ "statusCode": "200 }' },
    });

    const products = api.root.addResource('products');

    products.addMethod('GET', productsListIntegration);

    // Product API
    const product = products.addResource('{productId}');

    const productIntegration = new apigateway.LambdaIntegration(productHandler);

    product.addMethod('GET', productIntegration);
  }
}