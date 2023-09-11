import { handler } from "./getWidget";
import widgetService from "../database/services";
import { Context } from "aws-lambda";
import { mockApiGatewayEvent, mockWidget } from "./mocks";

jest.mock("../database/services");

describe("getWidget handler", () => {
  it("should return a widget", async () => {
    (widgetService.getWidget as jest.Mock).mockResolvedValue(mockWidget);

    const response = await handler(mockApiGatewayEvent, {} as Context, jest.fn());

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(JSON.stringify(mockWidget));
  });

  it("should return a 400 error if widget retrieval fails", async () => {
    (widgetService.getWidget as jest.Mock).mockRejectedValue("Error");

    const response = await handler(mockApiGatewayEvent, {} as Context, jest.fn());

    expect(response.statusCode).toBe(500);
    expect(response.body).toBe(JSON.stringify({"message":"An error occurred"}));
  });
});
