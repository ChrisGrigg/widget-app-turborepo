import { handler } from "./getAllWidgets";
import widgetService from "../database/services";
import { Context } from "aws-lambda";
import { mockApiGatewayEvent, mockWidget } from "./mocks";

jest.mock("../database/services");

describe("getAllWidgets handler", () => {
  const mockWidgets = [
    mockWidget,
    {
      id: "456",
      name: "Test Widget 2",
      manufacturer: "Test Manufacturer 2",
      stockLevel: 5,
      createdAt: new Date().toISOString(),
    },
  ];

  it("should return all widgets", async () => {
    (widgetService.getAllWidgets as jest.Mock).mockResolvedValue(mockWidgets);

    const response = await handler(mockApiGatewayEvent, {} as Context, jest.fn());

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(JSON.stringify(mockWidgets));
  });

  it("should return a 400 error if widget retrieval fails", async () => {
    (widgetService.getAllWidgets as jest.Mock).mockRejectedValue("Error");

    const response = await handler(mockApiGatewayEvent, {} as Context, jest.fn());

    expect(response.statusCode).toBe(500);
    expect(response.body).toBe(JSON.stringify({"message":"An error occurred"}));
  });
});
