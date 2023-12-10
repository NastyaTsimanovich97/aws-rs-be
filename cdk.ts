import * as cdk from '@aws-cdk/core';

import { AwsHosting } from './lib/awsHosting';

import { ProductsService } from './services/product-service';
import { ImportService } from './services/import-service';

class AwsHostingStack extends cdk.Stack { // stack it is cloud formation
  constructor(parent: cdk.App, name: string) {
    super(parent, name);

    new AwsHosting(this, 'TsimanovichAWSRS');
  }
}

class ProductStack extends cdk.Stack { // stack it is cloud formation
  constructor(parent: cdk.App, name: string) {
    super(parent, name);

    new ProductsService(this, 'Products');
  }
}

class ImportStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string) {
    super(parent, name);

    new ImportService(this, 'Import');
  }
}

const app = new cdk.App();

new AwsHostingStack(app, 'TsimanovichAWSRS');
new ProductStack(app, 'TsimanovichAWSRSProduct');
new ImportStack(app, 'TsimanovichAWSRSImport');

app.synth();

