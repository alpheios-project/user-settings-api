import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { created, failure } from "./libs/response-lib";
import { validateKeyValue } from "./libs/validate-lib";

const TABLE_NAME = process.env.DATABASE_NAME

export async function main(event, context) {
  let settingName = event.pathParameters.id
  const data = event.body;
  if (! validateKeyValue(settingName,data)) {
      return failure({ status: false })
  }
  const params = {
    TableName: TABLE_NAME,
    Item: {
      userId: event.requestContext.authorizer.principalId,
      settingName: settingName,
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