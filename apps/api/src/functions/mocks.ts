import { APIGatewayEvent } from "aws-lambda";

// this is for GET but can be overidden with a spread operator
export const mockApiGatewayEvent: APIGatewayEvent = {
  body: null,
  httpMethod: "GET",
  path: "/widgets/123",
  pathParameters: {
    id: "123",
  },
  resource: "/widgets/{id}",
  headers: {
    'Content-Type': 'application/json',
  },
  queryStringParameters: null,
  stageVariables: null,
  requestContext: null,
  multiValueHeaders: null,
  isBase64Encoded: false,
  multiValueQueryStringParameters: null,
};

export const mockWidget = {
  id: "123",
  name: "Test Widget",
  manufacturer: "Test Manufacturer",
  stockLevel: 10,
  createdAt: new Date().toISOString(),
};
