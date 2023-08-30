# Widget server using Serverless framework

This template demonstrates a CRUD Rest API, backed by DynamoDB database, running on AWS Lambda, deployed and run by the Serverless Framework.

### Setup

```
pnpm install
npx serverless dynamodb migrate
pnpm start
```

### Unit tests

```
pnpm test
```

### Endpoint testing

``````
curl -X POST -H "Content-Type:application/json" http://localhost:3000/dev/create-widget --data '{ "name": "Second", "manufacturer": "Apox", "stockLevel": 55 }'
curl -X DELETE -H "Content-Type:application/json" http://localhost:3000/dev/delete-widget/459449ce-18dc-4554-a627-c91dc8524e44
curl -H "Content-Type:application/json" http://localhost:3000/dev/get-widget/4dd04363-4a42-44e4-93ec-103d2210b972
curl -H "Content-Type:application/json" http://localhost:3000/dev/get-widgets
curl -X PUT -H "Content-Type:application/json" http://localhost:3000/dev/update-widget/4dd04363-4a42-44e4-93ec-103d2210b972 --data '{ "name": "Third", "manufacturer": "Apox", "stockLevel": 57 }'
``````
