import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { created, failure } from "./libs/response-lib";

const TABLE_NAME = process.env.DATABASE_NAME

export async function main(event, context) {
  const data = JSON.parse(event.body);
  console.log(data)
  const params = {
    TableName: TABLE_NAME,
    Item: {
      userId: event.requestContext.authorizer.principalId,
      settingName: event.pathParameters.id,
      content: data,
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return created(params.Item);
  } catch (e) {
    console.log(e)
    return failure({ status: false });
  }
}