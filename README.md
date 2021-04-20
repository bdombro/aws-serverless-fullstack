# AWS-SERVERLESS-FULLSTACK

...is a template to create a low-management, autoscaling NodeJS api + database on AWS

## Setup

This guide assumes you have already
- [set up an AWS account](http://docs.aws.amazon.com/AmazonSimpleDB/latest/DeveloperGuide/AboutAWSAccounts.html)
- have the latest version of the [AWS CLI](https://aws.amazon.com/cli/) installed
- have the latest version of the [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) installed

1. Update the `samconfig.toml` file with your choices
1. Run `npm i` - this installs the node dependencies
1. Deploy to AWS using `sam build && sam deploy`
1. View your stacks online at [CloudFormation](https://console.aws.amazon.com/cloudformation/home), or open your API at the URL from the deploy output.

To delete your stack, run `aws cloudformation delete-stack --stack-name (name of your stack) --region us-east-1`

## References

- https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html
- https://github.com/vendia/serverless-express
- https://github.com/claudiajs/claudia

