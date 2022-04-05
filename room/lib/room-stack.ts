import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as db from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda-go";
import * as ssm from "@aws-cdk/aws-ssm";

export class RoomStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // SSM Parameters
    const sampleParam = ssm.StringParameter.fromStringParameterAttributes(
      this,
      "SampleParam",
      {
        parameterName: "/CDK/Sample/SampleParam",
      }
    );

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
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
    });

    // DynamoDB
    // https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-dynamodb.Table.html
    const operationTable = new db.Table(this, "OperationTable", {
      tableName: "operation",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: db.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "room_id", type: db.AttributeType.STRING },
    });
    const roomTable = new db.Table(this, "RoomTable", {
      tableName: "room",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: db.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "room_id", type: db.AttributeType.STRING },
      sortKey: { name: "user_id", type: db.AttributeType.STRING },
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

    // Deploy lambda functions
    new lambda.GoFunction(this, "sample", {
      functionName: "cdkLambdaSample",
      entry: "lambda/sample",
      environment: {
        SAMPLE_PARAM: sampleParam.stringValue,
      },
    });

    // Stack Ouputs
    new cdk.CfnOutput(this, "STACK_REGION", { value: this.region });
  }
}
