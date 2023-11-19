import { Construct, Stack } from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as iam from '@aws-cdk/aws-iam';

export class AwsHosting extends Construct {
  constructor(parent: Stack, name: string) {
    super(parent, name);

    const cloudFrontOAI = new cloudfront.OriginAccessIdentity(this, "tsimanovich-aws-rs-oai");

    const siteBucket = new s3.Bucket(this, 'tsimanovich-aws-rs', {
      bucketName: 'tsimanovich-aws-rs',
      websiteIndexDocument: 'index.html',
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    siteBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['S3:GetObject'],
      resources: [siteBucket.arnForObjects('*')],
      principals: [new iam.CanonicalUserPrincipal(cloudFrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)],
    }));

    const cloudFrontDistribution = new cloudfront.CloudFrontWebDistribution(this, "tsimanovich-aws-rs-distribution", {
      originConfigs: [{
        s3OriginSource: {
          s3BucketSource: siteBucket,
          originAccessIdentity: cloudFrontOAI,
        },
        behaviors: [{
          isDefaultBehavior: true,
        }]
      }]
    });

    new s3deploy.BucketDeployment(this, 'tsimanovich-aws-rs-bucket-deployment', {
      sources: [s3deploy.Source.asset('../aws-rs-fe/dist')],
      destinationBucket: siteBucket,
      distribution: cloudFrontDistribution,
      distributionPaths: ['/*'],
    });
  }
}