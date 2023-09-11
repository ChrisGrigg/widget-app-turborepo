# CDK for deployment of Widget Manager to AWS

CDK functionality to deploy apps in this monorepo to AWS.

## Steps to run locally

* Install aws-sam on your system https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html
* `pnpm start`

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
