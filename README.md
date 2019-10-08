# Alpheios User Settings API

## API Documentation

Operation: `GET /settings`

Description: returns all settings for the authorized principal

Required Request Header: `Authorization: Bearer <access token>`

Response Content-Type: `application/json`

Success Response Code: `200`

Success Response Body: Object containg Key/Value pairs. Keys are setting names. Values are escaped string values.

Success Response Body Example: `{"alpheios-ui-options__2__panelPosition":"\"right\""}`


Error Condition: Invalid or missing access token

Error Response Code: `401`

Error Response Body: `{ "message": "unauthorized"}`


Error Condition: Unexpected error

Error Response Code: `500`

Error Response Body: `{ "status": false}`

---

Operation: `GET /settings?domain={domain}`

Description: returns all settings that begin with the supplied domain string for the authorized principal

Required Request Header: `Authorization: Bearer <access token>`

Required Path Parameter: `domain` - setting domain key 

Response Content-Type: `application/json`

Success Response Code: `200`

Success Response Body: Object containg Key/Value pairs. Keys are setting names. Values are escaped string values.

Success Response Body Example: `{"alpheios-ui-options__2__panelPosition":"\"right\""}`

Error Condition: Invalid or missing access token

Error Response Code: `401`

Error Response Body: `{ "message": "unauthorized"}`


Error Condition: Unexpected error

Error Response Code: `500`

Error Response Body: `{ "status": false}`

---

Operation: `GET /settings/{id}`

Description: returns a specific setting for the authorized principal

Required Request Header: `Authorization: Bearer <access token>`

Required Path Parameter: `id` - a setting id in the format `<domain>_<version>_<name>[<_group>]`

Response Content-Type: `application/json`

Success Response Code: `200`

Success Response Body: Escaped string 

Success Response Body Example: "\"right\""



Error Condition: Invalid or missing access token

Error Response Code: `401`

Error Response Body: `{ "message": "unauthorized"}`

Error Condition: Item not found


Error Response Code: `500`

Error Response Body: `{ "status": "Item not found"}`


Error Condition: Unexpected error

Error Response Code: `500`

Error Response Body: `{ "status": false}`

---

Operation: `POST /settings/{id}` 

Description: saves a new setting value (or replaces if existing) for the authorized principal
             
Required Request Header: `Authorization: Bearer <access token>`

Required Path Parameter: `id` - a setting id in the format `<domain>_<version>_<name>[<_group>]`

Required Request Body: escaped string value for the setting

Response Content-Type: `application/json`

Success Response Code: `201`

Success Response Body: Created JSON object

Success Response Body Example: `{"userId":"auth0|9999999999999999","settingName":"alpheios-feature-options__2__preferredLanguage","content":"\"grc\"","createdAt":1570555515030}`


Error Condition: Invalid or missing access token

Error Response Code: `401`

Error Response Body: `{ "message": "unauthorized"}`


Error Condition: Invalid data or unexpected error

Error Response Code: `500`

Error Response Body: `{ "status": false}`

---

Operation: `PUT /settings/{id}` 

Description: updates a setting value for the authorized principal

Required Request Header: `Authorization: Bearer <access token>`

Required Path Parameter: `id` - a setting id in the format `<domain>_<version>_<name>[<_group>]`

Required Request Body: escaped string value for the setting


Response Content-Type: `application/json`

Success Response Code: `200`

Success Response Body: `{ "status": true }`


Error Condition: Invalid or missing access token

Error Response Code: `401`

Error Response Body: `{ "message": "unauthorized"}`


Error Condition: Invalid data or unexpected error

Error Response Code: `500`

Error Response Body: `{ "status": false}`

---

Operation: `DELETE /settings/{id}` 

Description:  deletes a single setting for the authorized principal

Required Request Header: `Authorization: Bearer <access token>`

Required Path Parameter: `id` - a setting id in the format `<domain>_<version>_<name>[<_group>]`

Response Content-Type: `application/json`

Success Response Code: `200`

Success Response Body: `{ "status": true }`


Error Condition: Invalid or missing access token

Error Response Code: `401`

Error Response Body: `{ "message": "unauthorized"}`


Error Condition: Unexpected error

Error Response Code: `500`

Error Response Body: `{ "status": false}`

---

Operation: `DELETE  /settings?domain={domain}` 

Description: deletes all settings that begin with teh supplied domain string for the authorized principal

Required Request Header: `Authorization: Bearer <access token>`

Required Path Parameter: `domain` - setting domain key 

Response Content-Type: `application/json`

Success Response Code: `200`

Success Response Body: `{ "status": true }`


Error Condition: Invalid or missing access token

Error Response Code: `401`

Error Response Body: `{ "message": "unauthorized"}`


Error Condition: Unexpected error

Error Response Code: `500`

Error Response Body: `{ "status": false}`


## Authorization

Bearer Token.

API Operations are protected by login to the Alpheios Auth0 domain. All operations require a
Signed JWT Token granting access to the correct audience be supplied in an Author.


## Deployment Architecture

The Alpheios User Settings API is deployed as a set of Amazon Web Services Lambda Functions storing data in DynamoDB using the [Serverless Framework](https://serverless.com/). Access to the API is gated by use of a custom authorizer function, also deployed as an AWS Lambda function.

## Developer Instructions

References: this API was built using the Servless Stack following the tutorial at https://serverless-stack.com

### Prerequisites

**AWS IAM User**

Create an AWS IAM user with the following policy attached

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "s3:*",
                "apigateway:*",
                "logs:*",
                "lambda:*",
                "cloudformation:*",
                "dynamodb:*",
                "events:*"
            ],
            "Resource": "*"
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": [
                "iam:GetRole",
                "iam:GetRolePolicy"
            ],
            "Resource": "arn:aws:iam::*:role/*"
        },
        {
            "Sid": "VisualEditor2",
            "Effect": "Allow",
            "Action": "iam:CreateRole",
            "Resource": "arn:aws:iam::*:role/user-settings-api-*"
        },
        {
            "Sid": "VisualEditor3",
            "Effect": "Allow",
            "Action": "iam:PutRolePolicy",
            "Resource": "arn:aws:iam::*:role/user-settings-api-*"
        },
        {
            "Sid": "VisualEditor4",
            "Effect": "Allow",
            "Action": "iam:PassRole",
            "Resource": "arn:aws:iam::*:role/user-settings-api-*"
        }
    ]
}
```

**Python**

Python 2 version 2.6.5+ or Python 3 version 3.3+ and Pip

**AWS Cli**

Install and configure the AWS Cli with the AWS Access Key ID and Secret Access ID of the AWS IAM User.

`sudo pip install awscli`
`aws configure`

**DynamoDB**

Create a DynamoDB table with the following properties:

Primary partition key: userId (String)

Primary sort key: settingName (String)

**Serverless**

 `npm install serverless -g`
 
### Configuration
 
The following properties in the `serverless.yml` must be updated to match the AWS deployment environment:

  * `provider.stage` (e.g. prod or dev)
  * `provider.region` (e.g. us-east-2)
  * `provider.iamRoleStatements.Resource` (arn for the dynamo db resources, use a wildcard to enable db creation, arn:aws:dynamodb:us-east-2:*:*)

In addition, the provider must be setup with the following environment variables:

  * `AUTH0_CLIENT_PUBLIC_KEY` the public key that will be used to verify the JWT access tokens
  * `AUTH0_AUDIENCE` the audience which must include a grant in the JWT access token (e.g. alpheios.net:apis)
  * `AUTH0_TEST_ID` path to a file containing a mock access token that can be used by clients for testing
  * `DATABASE_NAME` name of the DynamoDB Table 
  * `VALID_DOMAINS` list of valid domains for setting keys

The Alpheios development environment has `AUTH0_CLIENT_PUBLIC_KEY` read from a file in the root directory named 'public_key' and the `AUTH0_TEST_ID` read from a file in the root directory named `test_id`. These files are kept in a private repository and copied for deployment.

### Testing 
  
  You can test invoking the API functions locally:
 
 ```
 serverless invoke local --function <function> --paths ./mocks/<filname>
 ```
 
 e.g. 

```serverless invoke local --function list --paths ./mocks/list-event.json```

Mocks are available for each operation.

Note that local API invocations WILL write to the remote DynamoDB.

Unit tests are available for library functions only currently.
  
### Deployment

Deploy to dev stage

```
serverless deploy --stage dev
```

Deploy to prod stage

```
serverless deploy 
```


