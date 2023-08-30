import { handler } from "./deleteWidget";
import widgetService from "../database/services";
import { APIGatewayEvent, Context } from "aws-lambda";
import { mockApiGatewayEvent } from "./mocks";

jest.mock("../database/services");

describe("deleteWidget handler", () => {
  const mockEvent: APIGatewayEvent = {
    httpMethod: "DELETE",
    ...mockApiGatewayEvent,
  };

  it("should delete a widget", async () => {
    (widgetService.deleteWidget as jest.Mock).mockResolvedValue({});

    const response = await handler(mockEvent, {} as Context, jest.fn());

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(JSON.stringify({}));
  });

  it("should return a 400 error if widget deletion fails", async () => {
    (widgetService.deleteWidget as jest.Mock).mockRejectedValue("Error");

    const response = await handler(mockEvent, {} as Context, jest.fn());

    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(JSON.stringify("Error"));
  });
});
