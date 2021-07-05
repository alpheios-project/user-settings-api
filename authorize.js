import * as jwt from "jsonwebtoken";

// Set in `environment` of serverless.yml
const AUTH0_CLIENT_PUBLIC_KEY = process.env.AUTH0_CLIENT_PUBLIC_KEY;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE
const AUTH0_TEST_ID = process.env.AUTH0_TEST_ID.trim()


export function main(event, context, callback) {
  console.log("Authorizing ", event)
  if (!event.authorizationToken) {
    return callback('Unauthorized');
  }
  const tokenParts = event.authorizationToken.split(' ');
  const tokenValue = tokenParts[1];

  if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
    // no auth token!
    return callback('Unauthorized');
  }
  const options = {
    audience: AUTH0_AUDIENCE
  };
  if (tokenValue === AUTH0_TEST_ID) {
    return callback(null, generatePolicy(AUTH0_TEST_ID, 'Allow', event.methodArn));
  }
  try {
    jwt.verify(tokenValue, AUTH0_CLIENT_PUBLIC_KEY, options, (verifyError, decoded) => {
      if (verifyError) {
        // 401 Unauthorized
        console.log(`Token invalid. ${verifyError}`);
        return callback('Unauthorized');
      }
      // is custom authorizer function
      console.log('valid from customAuthorizer', decoded);
      return callback(null, generatePolicy(decoded.sub, 'Allow', event.methodArn));
    });
  } catch (err) {
    console.log('catch error. Invalid token', err);
    return callback('Unauthorized');
  }
}
// Help function to generate an IAM policy
let generatePolicy = function(principalId, effect, resource) {
  let authResponse = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
      let policyDocument = {};
      policyDocument.Version = '2012-10-17';
      policyDocument.Statement = [];
      let statementOne = {};
      statementOne.Action = 'execute-api:Invoke';
      statementOne.Effect = effect;
      statementOne.Resource = resource;
      policyDocument.Statement[0] = statementOne;
      authResponse.policyDocument = policyDocument;
  }

  return authResponse;
}
