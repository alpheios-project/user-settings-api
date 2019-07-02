import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

const TABLE_NAME = process.env.DATABASE_NAME

export async function main(event, context) {
  console.log("List",event)
  let params = {
      TableName:TABLE_NAME,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": event.requestContext.authorizer.principalId
      }
  }


  try {
    const result = await dynamoDbLib.call("query", params);
    // Return the matching list of items in response body
    return success(result.Items.reduce(function(acc,cur,i) {
      acc[cur.settingName] = cur.content
      return acc
    },{}))
  } catch (e) {
    console.log(e)
    return failure({ status: false });
  }
}
