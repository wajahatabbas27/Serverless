#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EcomFixedAssetsStack } from '../lib/ecom_fixed_assets-stack';

const app = new cdk.App();
const service = 'ecom-fixed-assets';

let stage = 'main'
new EcomFixedAssetsStack(app, `${service}-${stage}`, {
  stackName: `${service}-${stage}`,
  tags: {
    service,
    stage
  }
});

stage = 'test'
new EcomFixedAssetsStack(app, `${service}-${stage}`, {
  stackName: `${service}-${stage}`,
  tags: {
    service,
    stage
  }
});