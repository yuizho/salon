import * as cdk from "@aws-cdk/core";
import * as db from "@aws-cdk/aws-dynamodb";

export class RoomStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB
    // https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-dynamodb.Table.html
    const operation_table = new db.Table(this, "OperationTable", {
      tableName: "operation",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: db.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "room_id", type: db.AttributeType.STRING },
    });
    const room_table = new db.Table(this, "RoomTable", {
      tableName: "room",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: db.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "room_id", type: db.AttributeType.STRING },
      sortKey: { name: "user_id", type: db.AttributeType.STRING },
    });

    // Stack Ouputs
    new cdk.CfnOutput(this, "STACK_REGION", { value: this.region });
  }
}
