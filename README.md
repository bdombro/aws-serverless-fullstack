# AWS-SERVERLESS-FULLSTACK

...is a template to create a low-management, autoscaling NodeJS api + database on AWS

## Setup

This guide assumes you have already [set up an AWS account](http://docs.aws.amazon.com/AmazonSimpleDB/latest/DeveloperGuide/AboutAWSAccounts.html) and have the latest version of the [AWS CLI](https://aws.amazon.com/cli/) installed.

1. Update the `config` section of `package.json`. If the bucket you specify does not yet exist, the next step will create it for you.
2. Run `yarn && yarn setup` - this installs the node dependencies, upserts an S3 bucket to hold CF packages, packs up your Node app, and deploys it along with database to AWS Lambda, API Gateway, RDS.
3. After the setup command completes, open the AWS CloudFormation console https://console.aws.amazon.com/cloudformation/home and switch to the region you specified. Select the stack (or the newly created stack, then click the `ApiUrl` value under the __Outputs__ section - this will open a new page with your running API.
4. (optional) To enable the `invoke-lambda` `package.json` `script`: copy the `LambdaFunctionName` from the CloudFormation Outputs and paste it into the `package.json` `config`'s `lambdaName` property. Run `yarn stack:lambda-invoke` to invoke the Lambda Function with the payload specified in `tests/mock-api-gateway-event.json`.

If you need to make modifications to your API Gateway API or other AWS resources, modify `sam-template.yaml` and run `yarn package-deploy`.

## References

- https://github.com/vendia/serverless-express