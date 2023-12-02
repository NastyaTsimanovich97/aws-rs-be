import { Construct } from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';

export class ImportService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Import bucket
    // const importBucket = new s3.Bucket(this, 'tsimanovich-import', {
    //   bucketName: 'tsimanovich-import', // /uploaded
    //   publicReadAccess: true,
    // });
  }
}
