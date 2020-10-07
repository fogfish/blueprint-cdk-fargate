import * as cdk from '@aws-cdk/core'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as ecs from '@aws-cdk/aws-ecs'
import * as iam from '@aws-cdk/aws-iam'
import * as log from '@aws-cdk/aws-logs'
import * as path from 'path'

export default (stack: cdk.Construct) => {
  //
  //
  const vpc = new ec2.Vpc(stack, 'Vpc', {
    maxAzs: 2,
    natGateways: 1,
  })
  
  //
  // execution role is required to bootstrap cluster operations
  // see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html
  const executionRole = new iam.Role(stack, 'EcsBootRole', {
    assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com')
  })
  executionRole.addToPolicy(
    new iam.PolicyStatement({
      resources: ['*'],
      actions: [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
      ],
    })
  )
  
  //
  // 
  const taskRole = new iam.Role(stack, 'EcsTaskRole', {
    assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com')
  })
  taskRole.addToPolicy(
    new iam.PolicyStatement({
      notResources: ['*'],
      notActions: ['*'],
    })
  )
  
  //
  //
  const memoryLimitMiB = 512
  const cluster = new ecs.Cluster(stack, 'Ecs', { vpc })
  
  const taskDefinition = new ecs.FargateTaskDefinition(stack, 'EcsTask', {
    memoryLimitMiB,
    executionRole,
    taskRole,
  })
  
  const container = taskDefinition.addContainer('blueprint-cdk-fargate', {
    image: ecs.ContainerImage.fromAsset(path.resolve(__dirname, '../docker')),
    memoryLimitMiB,
    logging: ecs.LogDriver.awsLogs({
      streamPrefix: 'blueprint-cdk-fargate',
      logRetention: log.RetentionDays.ONE_DAY,
    }),
  })
  container.addPortMappings({ containerPort: 8080 })
  
  const service = new ecs.FargateService(stack, 'Service', {
    cluster,
    assignPublicIp: true,
    desiredCount: 1,
    taskDefinition,
    serviceName: 'blueprint-cdk-fargate',
    vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  })
  service.connections.allowFromAnyIpv4(
    new ec2.Port({
      protocol: ec2.Protocol.TCP,
      fromPort: 8080,
      toPort: 8080,
      stringRepresentation: 'http-alt'
    })
  )
} 