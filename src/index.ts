import * as cdk from '@aws-cdk/core'
import cluster from './cluster'

const app = new cdk.App()
const stack = new cdk.Stack(app, 'blueprint-cdk-fargate', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  }
})

cluster(stack)

app.synth()