import { handler } from "./updateWidget";
import widgetService from "../database/services";
import { APIGatewayEvent, Context } from "aws-lambda";
import { mockApiGatewayEvent } from "./mocks";

jest.mock("../database/services");

describe("updateWidget handler", () => {
  let mockEvent: APIGatewayEvent;
  
  beforeEach(() => {
    jest.resetAllMocks();
    // as updateWidget.ts returns the widget object it needs to be
    // initialised each time, resetAllMocks doesn't do it
    mockEvent = {
      ...mockApiGatewayEvent,
      body: JSON.stringify({
        name: "Test Widget",
        manufacturer: "Test Manufacturer",
        stockLevel: 10,
      }),
    };
  });

  const mockWidget = {
    id: "456",
    name: "Test Widget 456",
    manufacturer: "Test Manufacturer 456",
    stockLevel: 100,
    createdAt: new Date().toISOString(),
  };

  it("should update a widget", async () => {
    (widgetService.updateWidget as jest.Mock).mockResolvedValue(mockWidget);

    const response = await handler(mockEvent, {} as Context, jest.fn());

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(JSON.stringify(mockWidget));
  });

  it("should return a 400 error if widget update fails", async () => {
    (widgetService.updateWidget as jest.Mock).mockRejectedValue("Error");

    const response = await handler(mockEvent, {} as Context, jest.fn());

    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(JSON.stringify("Error"));
  });
});
