import { Construct } from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import * as path from 'path';
import { JsonSchemaType } from '@aws-cdk/aws-apigateway';

export class ProductsService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const productsTable = dynamodb.Table.fromTableArn(this, 'tsimanovich-products', 'arn:aws:dynamodb:eu-west-1:900769118849:table/tsimanovich-products');

    const stocksTable = dynamodb.Table.fromTableArn(this, 'tsimanovich-stocks', 'arn:aws:dynamodb:eu-west-1:900769118849:table/tsimanovich-stocks');

    // Products List
    const listBucket = new s3.Bucket(this, 'ProductsList');

    const getProductsListHandler = new NodejsFunction(this, 'getProductsListHandler', {
      memorySize: 1024,
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: path.join(__dirname, `./lambdas/getProductsList/index.ts`),
      handler: 'handler',
      environment: {
        BUCKET: listBucket.bucketName,
        PRODUCTS_TABLE: productsTable.tableName,
        STOCKS_TABLE: stocksTable.tableName,
      }
    });

    listBucket.grantReadWrite(getProductsListHandler);
    productsTable.grantReadData(getProductsListHandler);
    stocksTable.grantReadData(getProductsListHandler);

    // Product Get By Id
    const productBucket = new s3.Bucket(this, 'Product');

    const getProductsByIdHandler = new NodejsFunction(this, 'getProductsByIdHandler', {
      memorySize: 1024,
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: path.join(__dirname, `./lambdas/getProductsById/index.ts`),
      handler: 'handler',
      environment: {
        BUCKET: productBucket.bucketName,
        PRODUCTS_TABLE: productsTable.tableName,
        STOCKS_TABLE: stocksTable.tableName,
      }
    });

    productBucket.grantReadWrite(getProductsByIdHandler);
    productsTable.grantReadData(getProductsByIdHandler);
    stocksTable.grantReadData(getProductsByIdHandler);

    // Product Create
    const productCreateBucket = new s3.Bucket(this, 'CreateProduct');

    const createProductHandler = new NodejsFunction(this, 'createProductHandler', {
      memorySize: 1024,
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: path.join(__dirname, `./lambdas/createProduct/index.ts`),
      handler: 'handler',
      environment: {
        BUCKET: productCreateBucket.bucketName,
        PRODUCTS_TABLE: productsTable.tableName,
        STOCKS_TABLE: stocksTable.tableName,
      }
    });

    productCreateBucket.grantReadWrite(createProductHandler);
    productsTable.grantReadWriteData(createProductHandler);
    stocksTable.grantReadWriteData(createProductHandler);

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

    const productBodySchema = new apigateway.Model(this, 'model-validator', {
      restApi: api,
      contentType: 'application/json',
      description: 'To validate the PRODUCT request body',
      modelName: 'greetmodelcdk',
      schema: {
        type: JsonSchemaType.OBJECT,
        required: ['id', 'title', 'description', 'price', 'count'],
        properties: {
          id: { type: apigateway.JsonSchemaType.STRING },
          title: { type: apigateway.JsonSchemaType.STRING },
          description: { type: apigateway.JsonSchemaType.STRING },
          price: { type: apigateway.JsonSchemaType.NUMBER },
          count: { type: apigateway.JsonSchemaType.NUMBER },
        },
      },
    });

    const products = api.root.addResource('products');

    const productsListIntegration = new apigateway.LambdaIntegration(getProductsListHandler, {
      requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
    });
    products.addMethod('GET', productsListIntegration);

    const createProductIntegration = new apigateway.LambdaIntegration(createProductHandler);
    products.addMethod('POST', createProductIntegration, {
      requestModels: {
        'application/json': productBodySchema,
      },
      requestValidatorOptions: {
        validateRequestBody: true,
      },
    });

    // Product ID API
    const product = products.addResource('{productId}');

    const productIntegration = new apigateway.LambdaIntegration(getProductsByIdHandler);

    product.addMethod('GET', productIntegration);
  }
}