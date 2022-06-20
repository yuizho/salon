import { Stack, StackProps, RemovalPolicy, CfnOutput, Expiration, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as db from 'aws-cdk-lib/aws-dynamodb';
import * as lambdaGo from '@aws-cdk/aws-lambda-go-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { FieldLogLevel } from '@aws-cdk/aws-appsync-alpha';
import * as waf from 'aws-cdk-lib/aws-wafv2';

export class RoomStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // ================= DynamoDB =================
    // TODO: save operation logs to S3 by Dynamo DB Stream
    // https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-dynamodb.Table.html
    const operationTable = new db.Table(this, 'OperationTable', {
      tableName: 'operation',
      removalPolicy: RemovalPolicy.RETAIN,
      billingMode: db.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'event_id', type: db.AttributeType.STRING },
      // https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-dynamodb.StreamViewType.html
      stream: db.StreamViewType.NEW_IMAGE,
    });
    const roomTable = new db.Table(this, 'RoomTable', {
      tableName: 'room',
      removalPolicy: RemovalPolicy.RETAIN,
      billingMode: db.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'room_id', type: db.AttributeType.STRING },
      sortKey: { name: 'item_key', type: db.AttributeType.STRING },
      timeToLiveAttribute: 'expiration_unix_timestamp',
      stream: db.StreamViewType.NEW_IMAGE,
    });

    // ================= AppSync =================
    const roomAPI = new appsync.GraphqlApi(this, 'RoomAPI', {
      name: 'RoomAPI',
      schema: appsync.Schema.fromAsset('../graphql/schema.graphql'),
      xrayEnabled: true,
      logConfig: {
        excludeVerboseContent: true,
        fieldLogLevel: FieldLogLevel.ALL,
      },
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.API_KEY,
            apiKeyConfig: {
              name: 'default',
              description: 'default auth mode',
              expires: Expiration.after(Duration.days(365)),
            },
          },
        ],
      },
    });
    // Set up table as a Datasource and grant access
    const operationDataSource = roomAPI.addDynamoDbDataSource('operation', operationTable);
    operationDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'openRoom',
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        'appsync/room-api/resolvers/Mutation.openRoom.req.vtl',
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
    operationDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'join',
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        'appsync/room-api/resolvers/Mutation.join.req.vtl',
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
    operationDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'leave',
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        'appsync/room-api/resolvers/Mutation.leave.req.vtl',
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
    operationDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'pick',
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        'appsync/room-api/resolvers/Mutation.pick.req.vtl',
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
    operationDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'refreshTable',
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        'appsync/room-api/resolvers/Mutation.refreshTable.req.vtl',
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
    operationDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'kick',
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        'appsync/room-api/resolvers/Mutation.kick.req.vtl',
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
    const roomDataSource = roomAPI.addDynamoDbDataSource('room', roomTable);
    const UserDataSource = roomAPI.addNoneDataSource('poker');
    // Define resolvers
    roomDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'getRoom',
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        'appsync/room-api/resolvers/Query.getRoom.req.vtl',
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        'appsync/room-api/resolvers/Query.getRoom.resp.vtl',
      ),
    });
    UserDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'updateUser',
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        'appsync/room-api/resolvers/Mutation.updateUser.req.vtl',
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });

    // ================= Lambda =================
    const roomRMUFunction = new lambdaGo.GoFunction(this, 'room-rmu', {
      functionName: 'RoomRMU',
      entry: 'lambda/room-rmu',
      timeout: Duration.seconds(10),
      tracing: lambda.Tracing.ACTIVE,
    });
    // https://docs.aws.amazon.com/cdk/api/v1/docs/aws-lambda-event-sources-readme.html#dynamodb-streams
    roomRMUFunction.addEventSource(
      new DynamoEventSource(operationTable, {
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        retryAttempts: 3,
      }),
    );
    roomTable.grantReadWriteData(roomRMUFunction);

    const mutateUserFunction = new lambdaGo.GoFunction(this, 'mutate-user', {
      functionName: 'MutateUser',
      entry: 'lambda/mutate-user',
      environment: {
        ROOM_API_URL: roomAPI.graphqlUrl,
        REGION: this.region,
      },
      timeout: Duration.seconds(10),
      tracing: lambda.Tracing.ACTIVE,
    });
    mutateUserFunction.addEventSource(
      new DynamoEventSource(roomTable, {
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        retryAttempts: 3,
      }),
    );
    // configure IAM Role
    if (typeof mutateUserFunction.role !== 'undefined') {
      roomAPI.grant(
        mutateUserFunction.role,
        appsync.IamResource.custom('types/Mutation/fields/updateUser'),
        'appsync:GraphQL',
      );
    }

    // ================= WAF =================
    const apiWebAcl = new waf.CfnWebACL(this, 'RoomAPI-WebAcl', {
      defaultAction: { allow: {} },
      scope: 'REGIONAL',
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        sampledRequestsEnabled: true,
        metricName: 'RoomAPI-WebAclMetric',
      },
      rules: [
        {
          name: 'FloodProtection',
          action: { block: {} },
          priority: 1,
          statement: {
            rateBasedStatement: {
              aggregateKeyType: 'IP',
              limit: 300,
              scopeDownStatement: {
                regexMatchStatement: {
                  fieldToMatch: { singleHeader: { name: 'x-api-key' } },
                  regexString: `^${roomAPI.apiKey!}$`,
                  textTransformations: [{ priority: 0, type: 'COMPRESS_WHITE_SPACE' }],
                },
              },
            },
          },
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            sampledRequestsEnabled: true,
            metricName: `RoomAPI-FloodProtection`,
          },
        },
      ],
    });
    const webAclAssociation = new waf.CfnWebACLAssociation(this, 'webAclAssociation', {
      resourceArn: roomAPI.arn,
      webAclArn: apiWebAcl.attrArn,
    });

    // ================= Stack Outpu =================
    new CfnOutput(this, 'STACK_REGION', { value: this.region });
    new CfnOutput(this, 'ROOM_API_URL', { value: roomAPI.graphqlUrl });
    new CfnOutput(this, 'ROOM_API_KEY', { value: roomAPI.apiKey! });
    new CfnOutput(this, 'ACLRef', { value: apiWebAcl.ref });
    new CfnOutput(this, 'ACLAPIAssoc', { value: webAclAssociation.ref });
  }
}
