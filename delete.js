import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

const TABLE_NAME = process.env.DATABASE_NAME

export async function main(event, context) {
  const params = {
    TableName: TABLE_NAME,
    // 'Key' defines the partition key and sort key of the item to be removed
    // - 'userId': identity id of the authenticated user
    // - 'wordId': path parameter
    Key: {
      userId: event.requestContext.authorizer.principalId,
      settingName: event.pathParameters.id
    }
  };

  try {
    const result = await dynamoDbLib.call("delete", params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}