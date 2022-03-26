import * as cdk from "@aws-cdk/core";
import * as db from "@aws-cdk/aws-dynamodb";

export class InfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const room_table = new db.Table(this, "room", {
      partitionKey: { name: "room_id", type: db.AttributeType.STRING },
      sortKey: { name: "user_id", type: db.AttributeType.STRING },
    });
  }
}
