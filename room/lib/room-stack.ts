import {
  Stack,
  StackProps,
  RemovalPolicy,
  CfnOutput,
  Expiration,
  Duration,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import * as appsync from "@aws-cdk/aws-appsync-alpha";
import * as db from "aws-cdk-lib/aws-dynamodb";
import * as lambdaGo from "@aws-cdk/aws-lambda-go-alpha";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as ssm from "aws-cdk-lib/aws-ssm";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";

export class RoomStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // ================= DynamoDB =================
    // TODO: TTL config
    // TODO: save operation logs to S3 by Dynamo DB Stream
    // https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-dynamodb.Table.html
    const operationTable = new db.Table(this, "OperationTable", {
      tableName: "operation",
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: db.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "event_id", type: db.AttributeType.STRING },
      // https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-dynamodb.StreamViewType.html
      stream: db.StreamViewType.NEW_IMAGE,
    });
    const roomTable = new db.Table(this, "RoomTable", {
      tableName: "room",
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: db.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "room_id", type: db.AttributeType.STRING },
      sortKey: { name: "user_id", type: db.AttributeType.STRING },
      stream: db.StreamViewType.NEW_IMAGE,
    });

    // ================= AppSync =================
    // TODO: log
    // TODO: Xray
    // TODO: WAF
    const roomAPI = new appsync.GraphqlApi(this, "RoomAPI", {
      name: "RoomAPI",
      schema: appsync.Schema.fromAsset("appsync/room-api/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.API_KEY,
            apiKeyConfig: {
              name: "default",
              description: "default auth mode",
              expires: Expiration.after(Duration.days(365)),
            },
          },
        ],
      },
    });
    // Set up table as a Datasource and grant access
    const operationDataSource = roomAPI.addDynamoDbDataSource(
      "operation",
      operationTable
    );
    operationDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "openRoom",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        "appsync/room-api/resolvers/Mutation.openRoom.req.vtl"
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
    operationDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "join",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        "appsync/room-api/resolvers/Mutation.join.req.vtl"
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
    operationDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "leave",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        "appsync/room-api/resolvers/Mutation.leave.req.vtl"
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
    operationDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "pick",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        "appsync/room-api/resolvers/Mutation.pick.req.vtl"
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
    operationDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "refreshTable",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        "appsync/room-api/resolvers/Mutation.refreshTable.req.vtl"
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
    operationDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "heartbeat",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        "appsync/room-api/resolvers/Mutation.heartbeat.req.vtl"
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
    operationDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "kick",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        "appsync/room-api/resolvers/Mutation.kick.req.vtl"
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
    const roomDataSource = roomAPI.addDynamoDbDataSource("room", roomTable);
    const PokerDataSource = roomAPI.addNoneDataSource("poker");
    // Define resolvers
    roomDataSource.createResolver({
      typeName: "Query",
      fieldName: "getRoom",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        "appsync/room-api/resolvers/Query.getRoom.req.vtl"
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
    PokerDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "updatePoker",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        "appsync/room-api/resolvers/Mutation.updatePoker.req.vtl"
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });

    // ================= SSM =================
    const roomApiUrl = new ssm.StringParameter(this, "room-api-url", {
      parameterName: "/salon/appsync/room-api-url",
      stringValue: roomAPI.graphqlUrl,
    });
    const roomApiKey = new ssm.StringParameter(this, "room-api-key", {
      parameterName: "/salon/appsync/room-api-key",
      stringValue: roomAPI.apiKey!,
    });

    // ================= Lambda =================
    const roomRMUFunction = new lambdaGo.GoFunction(this, "room-rmu", {
      functionName: "RoomRMU",
      entry: "lambda/room-rmu",
    });
    // https://docs.aws.amazon.com/cdk/api/v1/docs/aws-lambda-event-sources-readme.html#dynamodb-streams
    roomRMUFunction.addEventSource(
      new DynamoEventSource(operationTable, {
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        retryAttempts: 3,
      })
    );
    roomTable.grantReadWriteData(roomRMUFunction);

    const mutatePokerFunction = new lambdaGo.GoFunction(this, "mutate-poker", {
      functionName: "MutatePoker",
      entry: "lambda/mutate-poker",
      environment: {
        ROOM_API_URL: roomApiUrl.stringValue,
        REGION: this.region,
      },
    });
    mutatePokerFunction.addEventSource(
      new DynamoEventSource(roomTable, {
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        retryAttempts: 3,
      })
    );
    // configure IAM Role
    if (typeof mutatePokerFunction.role !== "undefined") {
      roomAPI.grant(
        mutatePokerFunction.role,
        appsync.IamResource.custom("types/Mutation/fields/updatePoker"),
        "appsync:GraphQL"
      );
    }

    // ================= Stack Outpu =================
    new CfnOutput(this, "STACK_REGION", { value: this.region });
    new CfnOutput(this, "ROOM_API_URL", { value: roomApiUrl.stringValue });
    new CfnOutput(this, "ROOM_API_KEY", { value: roomApiKey.stringValue });
  }
}
