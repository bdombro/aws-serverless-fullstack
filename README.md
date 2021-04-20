# AWS-SERVERLESS-FULLSTACK

...is a template to create a low-management, autoscaling NodeJS api + database on AWS

What makes it cool:

1. 100% serverless full-stack with Static frontend, NodeJS api and MySQL db
1. Easy deploy management with AWS SAM + Cloudformation
1. Run locally, AWS, or anywhere with generic file and db connectors
1. All Javascript/Typescript
1. Uses Fastify framework, which is mucho faster than Express
1. DB ORM and schema management with Typeorm
1. Type-strict

## Running locally

1. Installed docker, node v14
1. `npm i`
1. `npm run dev:mysql`
1. `npm run dev`


## Deploying to AWS as Cloudformation Stack

Deploy assumes you have already
- [set up an AWS account](http://docs.aws.amazon.com/AmazonSimpleDB/latest/DeveloperGuide/AboutAWSAccounts.html)
- have the latest version of the [AWS CLI](https://aws.amazon.com/cli/) installed
- have the latest version of the [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) installed

1. Update the `samconfig.toml` file with your choices
1. Run `npm i` - this installs the node dependencies
1. Deploy to AWS using `sam build && sam deploy`
1. View your stacks online at [CloudFormation](https://console.aws.amazon.com/cloudformation/home), or open your API at the URL from the deploy output.

To delete your stack, run `aws cloudformation delete-stack --stack-name (name of your stack) --region us-east-1`

## Known Issues

When configured to sleep, API calls may timeout (28s) before the database finishes waking up. To tolerate this, the web application needs to retry API calls that fail due to database failures. Here is the expected response from the API on failure:

```json
{
  "error": {
    "type": "InternalServerError",
    "note": "Communications link failure\n\nThe last packet sent successfully to the server was 0 milliseconds ago. The driver has not received any packets from the server.",
    "context": {
      "errorSet": {}
    }
  }
}
```


## References

- https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html
- https://github.com/vendia/serverless-express
- https://github.com/claudiajs/claudia

