# Blueprint: Fargate

A minimal example of AWS Fargate with AWS CDK and GitHub actions.

## Key features

* Spawns AWS Fargate [cluster](src/cluster.ts) on your AWS account
* Builds a simple [http echo service](docker/echo.go) with Golang
* Automates blueprint delivery with GitHub Actions [pipeline](.github/workflows/check.yaml) 

## Getting started

```bash
npm install
npm run tsc
npm run test
npm run -- cdk synth
npm run -- cdk deploy
```
