/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import path = require('path');
import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as apigw from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3Deployment from "@aws-cdk/aws-s3-deployment";
import { Tags, Duration } from "@aws-cdk/core";

const {
  API_ID,
  DESCRIPTION,
  TAGS_KEY,
  TAGS_VALUE
} = process.env;

// this is an outdated version of the cdk and is untested, it's only to show intent
export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const uiCodeBucket = new s3.Bucket(this, 'WidgetBucketClientApp', {
      bucketName: `widget-bucket-ui-app-${this.account}`,
      publicReadAccess: true,
      websiteIndexDocument: "index.html"
    });

    const deployment = new s3Deployment.BucketDeployment(this, "deployStaticWebsite", {
      sources: [s3Deployment.Source.asset(`${path.resolve(__dirname)}/../../build`)],
      destinationBucket: uiCodeBucket
    });

    const bucket = new s3.Bucket(this, 'WidgetBucket', {
      bucketName: `widget-bucket-${this.account}`,
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
          ],
          allowedOrigins: ['http://localhost:3000'], // TODOs: Change to correct URL
          allowedHeaders: ['*'],
        },
      ]
    });

    const handler = new lambda.Function(this, "handler", {
      code: lambda.Code.fromAsset(`${path.resolve(__dirname)}/../dist/lambda/build`),
      handler: `index.handler`,
      runtime: lambda.Runtime.NODEJS_16_X,
      timeout: Duration.seconds(5),
      environment: {
        BUCKET: bucket.bucketName
      }
    });

    let api;
    if (API_ID) {
      api = new apigw.LambdaRestApi(this, API_ID || '', {
        handler,
        description: DESCRIPTION,
        proxy: false
      });

      const document = api.root.addResource('document');
      document.addMethod('GET');  // GET /document
      document.addMethod('PUT'); // PUT /document
      document.addMethod('OPTIONS');

      bucket.grantReadWrite(handler);

      if (TAGS_KEY && TAGS_VALUE) {
        Tags.of(handler).add(TAGS_KEY, TAGS_VALUE);
      }

      new cdk.CfnOutput(this, 'apiUrl', { value: api.url });
      new cdk.CfnOutput(this, 'bucketWebsiteUrl', {
        value: uiCodeBucket.bucketWebsiteUrl,
      });
    }
  }
}
