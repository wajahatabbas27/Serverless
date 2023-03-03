import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class EcomFixedAssetsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const service = props?.tags?.service;
    const stage = props?.tags?.stage;

    // ===========================================================================
    // Create username and password secret for DB Cluster
    // ===========================================================================
    const userAuroraSecret = new rds.DatabaseSecret(this, `${service}-${stage}-user-aurora-secret`, {
      secretName: `${service}-${stage}-user-aurora-secret`,
      username: `${service}-${stage}-cluster-admin`,
    });
    
    // ===========================================================================
    // The VPC to place the cluster in
    // ===========================================================================
    // const vpc = ec2.Vpc.fromVpcAttributes(this, `${service}-${stage}-aurora-vpc`, {
    //   vpcId: 'vpc-0b075e28f90cca935',
    //   availabilityZones: ['us-east-1'],
    // });
    
    // ===========================================================================
    // Create the serverless cluster, 
    // provide all values needed to customise the database.
    // ===========================================================================
    const userCluster = new rds.ServerlessCluster(this, `${service}-${stage}-user-serverless-cluster`, {
      engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
      // vpc,
      credentials: { username: `${service}-${stage}-cluster-admin` },
      clusterIdentifier: `${service}-${stage}-user-database-endpoint`,
      defaultDatabaseName: cammelCase(`${service}-${stage}-user-database`),
    });
    
    // ===========================================================================
    // Outputs
    // ===========================================================================
    new CfnOutput(this, `${service}-${stage}-user-serverless-cluster-arn`, {
      value: userCluster.clusterArn
    });
    new CfnOutput(this, `${service}-${stage}-user-aurora-secret-arn`, {
      value: userAuroraSecret.secretArn
    });

  }
}

// Function to convert `small-case-minus-separated` into `camelCaseString`
const cammelCase = (text:string) : string => {
  let arr = text.split('-');
  arr = arr.map((word:string) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
  return arr.join("")
}