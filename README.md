# Alpheios User Settings API

Built using the Servless Stack following the tutorial at https://serverless-stack.com

Operations:

GET /settings returns all settings for the authorized principal
GET /settings?domain={domain} returns all settings that begin with the supplied domain string for the authorized principal
GET /settings/{id} returns a specific setting value for the authorized principal
POST /settings/{id} saves a new setting value (or replaces if existing) for the authorized principal
PUT /settings/{id} updates a setting value for the authorized principal
DELETE /settings/{id} deletes a single setting for the authorized principal
DELETE /settings?domain={domai} deletes all settings that begin with teh supplied domain string for the authorized principal

Protected by login to the Alpheios Auth0 domain
