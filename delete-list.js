import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

const TABLE_NAME = process.env.DATABASE_NAME

export async function main(event, context) {
  const listParams = {
    TableName:TABLE_NAME,
    KeyConditionExpression: "userId = :userId AND begins_with(settingName,:domain)",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.authorizer.principalId,
      ":domain": event.queryStringParameters.domain
    }
  }

  try {
    const list = await dynamoDbLib.call("query", listParams);
    let failed = []
    // TODO we should do this in batches of 25 using batchWrite
    if (list.Count > 0) {
      for (let item of list.Items) {
        let params = {
          TableName: TABLE_NAME,
          Key: {
            userId: event.requestContext.authorizer.principalId,
            settingName: item.settingName
          }
        };
        try {
          let result = await dynamoDbLib.call("delete", params)
        } catch (e) {
          failed.push(item)
        }
      }
      if (failed.length > 0) {
        return failure({ status: false });
      }
    }
    return success({ status: true });
  } catch (e) {
    console.log(e)
    return failure({ status: false });
  }
}