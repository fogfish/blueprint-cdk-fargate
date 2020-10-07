import { expect, countResources } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import cluster from '../src/cluster'

const resources: { [key:string]: number } = {
  'AWS::EC2::VPC': 1,
  'AWS::EC2::Subnet': 4,
  'AWS::EC2::RouteTable': 4,
  'AWS::EC2::SubnetRouteTableAssociation': 4,
  'AWS::EC2::Route': 4,
  'AWS::EC2::EIP': 1,
  'AWS::EC2::NatGateway': 1,
  'AWS::EC2::InternetGateway': 1,
  'AWS::EC2::VPCGatewayAttachment': 1,
  'AWS::IAM::Role': 2,
  'AWS::IAM::Policy': 2,
  'AWS::ECS::Cluster': 1,
  'AWS::ECS::TaskDefinition': 1,
  'AWS::Logs::LogGroup': 1,
  'AWS::ECS::Service': 1,
  'AWS::EC2::SecurityGroup': 1,
}

test('extender spawns required resources', () => {
  const app = new cdk.App()
  const stack = new cdk.Stack(app, 'Stack', {})
  cluster(stack)

  Object.keys(resources).forEach(
    x => expect(stack).to(countResources(x, resources[x]))
  )
})