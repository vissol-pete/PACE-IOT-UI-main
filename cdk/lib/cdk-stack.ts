// import { Stack, StackProps } from 'aws-cdk-lib';
import * as cdk from "aws-cdk-lib";
// import * as cdk from '@aws-cdk/core'; //CDK VERSION 1 USES  /core and individial modoules installed from ex: @aws-cdk/aws-s3
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import {
  CloudFrontWebDistribution,
  OriginAccessIdentity,
  ErrorResponse,
  CfnDistribution,
} from "aws-cdk-lib/aws-cloudfront";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import { RemovalPolicy } from "aws-cdk-lib";
import * as codecommit from "aws-cdk-lib/aws-codecommit";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import * as iam from "aws-cdk-lib/aws-iam";
// import * as lambda from 'aws-cdk-lib/aws-lambda'
// import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { Construct } from "constructs";

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 resource
    let siteBucket = new Bucket(this, "SiteBucket", {
      bucketName: `pace-iot-bucket-${this.account}`,
      websiteIndexDocument: "index.html",
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const oia = new OriginAccessIdentity(this, "OIA", {
      comment: "Created by CDK",
    });
    siteBucket.grantRead(oia);

    // Cloudfront error response
    const errorResponse1: CfnDistribution.CustomErrorResponseProperty = {
      errorCode: 404,
      // the properties below are optional
      responseCode: 200,
      responsePagePath: "/index.html",
    };

    const errorResponse2: CfnDistribution.CustomErrorResponseProperty = {
      errorCode: 403,
      // the properties below are optional
      responseCode: 200,
      responsePagePath: "/index.html",
    };

    // Cloudfront Dist
    const distribution = new CloudFrontWebDistribution(
      this,
      "cdk-example-distribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: siteBucket,
              originAccessIdentity: oia,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
        comment: "Deployed by CDK",
        errorConfigurations: [errorResponse1, errorResponse2],
      }
    );

    // Create a new SSM Parameter holding a String
    const param = new ssm.StringParameter(this, "StringParameter", {
      // allowedPattern: '.*',
      description: "Made using CDK",
      parameterName: "/pace/CDN",
      stringValue: `https://${distribution.distributionDomainName}`,
    });

    // S3 deployment
    new BucketDeployment(this, "DeployWebsite", {
      sources: [Source.asset("../build")],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}
