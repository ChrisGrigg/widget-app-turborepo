import { handler } from "./createWidget";
import widgetService from "../database/services";
import { APIGatewayEvent, Context } from "aws-lambda";
import { mockApiGatewayEvent } from "./mocks";

jest.mock("../database/services");

describe("createWidget handler", () => {
  let mockEvent: APIGatewayEvent;

  beforeEach(() => {
    jest.resetAllMocks();
    // as updateWidget.ts returns the widget object it needs to be
    // initialised each time, resetAllMocks doesn't do it
    mockEvent = {
      ...mockApiGatewayEvent,
      httpMethod: "POST",
      body: JSON.stringify({
        name: "Test Widget",
        manufacturer: "Test Manufacturer",
        stockLevel: 10,
      }),
    };
  });

  const mockWidget = {
    id: "123",
    name: "Test Widget",
    manufacturer: "Test Manufacturer",
    stockLevel: 10,
    createdAt: new Date().toISOString(),
  };

  it("should create a widget", async () => {
    (widgetService.createWidget as jest.Mock).mockResolvedValue(mockWidget);

    const response = await handler(mockEvent, {} as Context, jest.fn());

    expect(response.statusCode).toBe(201);
    expect(response.body).toBe(JSON.stringify(mockWidget));
  });

  it("should return a 400 error if widget creation fails", async () => {
    (widgetService.createWidget as jest.Mock).mockRejectedValue("Error");

    const response = await handler(mockEvent, {} as Context, jest.fn());

    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(JSON.stringify("Error"));
  });
});
