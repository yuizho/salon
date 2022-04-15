import {
  Stack,
  StackProps,
  RemovalPolicy,
  CfnOutput,
  Expiration,
  Duration,
} from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as appsync from "@aws-cdk/aws-appsync-alpha";
import * as db from "aws-cdk-lib/aws-dynamodb";
import * as lambdaGo from "@aws-cdk/aws-lambda-go-alpha";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as ssm from "aws-cdk-lib/aws-ssm";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { StreamViewType } from "aws-cdk-lib/aws-dynamodb";

export class RoomStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // AppSync
    const api = new appsync.GraphqlApi(this, "RoomAPI", {
      name: "RoomAPI",
      schema: appsync.Schema.fromAsset("appsync/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            name: "default",
            description: "default auth mode",
            expires: Expiration.after(Duration.days(365)),
          },
        },
      },
    });

    // DynamoDB
    // https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-dynamodb.Table.html
    const operationTable = new db.Table(this, "OperationTable", {
      tableName: "operation",
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: db.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "room_id", type: db.AttributeType.STRING },
    });
    const roomTable = new db.Table(this, "RoomTable", {
      tableName: "room",
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: db.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "room_id", type: db.AttributeType.STRING },
      sortKey: { name: "user_id", type: db.AttributeType.STRING },
      // https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-dynamodb.StreamViewType.html
      stream: StreamViewType.NEW_IMAGE,
    });

    // Set up table as a Datasource and grant access
    const roomDataSource = api.addDynamoDbDataSource("room", roomTable);
    const PokerDataSource = api.addNoneDataSource("poker");

    // Define resolvers
    roomDataSource.createResolver({
      typeName: "Query",
      fieldName: "getRoom",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        "appsync/resolvers/Query.getRoom.req.vtl"
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
    PokerDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "updatePoker",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        "appsync/resolvers/Mutation.updatePoker.req.vtl"
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });

    // SSM Parameters
    const roomApiUrl = new ssm.StringParameter(this, "room-api-url", {
      parameterName: "/salon/appsync/room-api-url",
      stringValue: api.graphqlUrl,
    });
    const roomApiKey = new ssm.StringParameter(this, "room-api-key", {
      parameterName: "/salon/appsync/room-api-key",
      stringValue: api.apiKey!,
    });

    // Deploy lambda functions
    const mutatePokerFunction = new lambdaGo.GoFunction(this, "mutate-poker", {
      functionName: "MutatePoker",
      entry: "lambda/mutate-poker",
      environment: {
        ROOM_API_URL: roomApiUrl.stringValue,
        ROOM_API_KEY: roomApiKey.stringValue,
      },
    });
    // https://docs.aws.amazon.com/cdk/api/v1/docs/aws-lambda-event-sources-readme.html#dynamodb-streams
    mutatePokerFunction.addEventSource(
      new DynamoEventSource(roomTable, {
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        retryAttempts: 3,
      })
    );

    // Stack Ouputs
    new CfnOutput(this, "STACK_REGION", { value: this.region });
  }
}
